const API_ESPACIOS = 'http://localhost:9000/espacio/listar';
const SSE_URL = 'http://localhost:3001/sse/espacios';
const API_ESTADO_CAMBIAR = 'http://localhost:9000/espacio/estado';

// 1. Redirección temprana si no hay token
const token = localStorage.getItem('access_token');
if (!token) {
    window.location.href = 'login.html';
}

// 2. Decodificación de JWT en el cliente
const decodeJWT = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Error al decodificar JWT:", e);
        return null;
    }
};

const userPayload = decodeJWT(token);
if (!userPayload) {
    localStorage.clear();
    window.location.href = 'login.html';
} else {
    // Verificar si el token ha expirado
    const currentTime = Math.floor(Date.now() / 1000);
    if (userPayload.exp && userPayload.exp < currentTime) {
        console.warn("Sesión expirada por JWT exp claim.");
        localStorage.clear();
        window.location.href = 'login.html';
    }
}

// Datos del perfil
const username = userPayload.username || 'root';
const roles = userPayload.roles || ['Cliente'];
const mainRole = roles[0];

// Mostrar en la interfaz
document.getElementById('usernameDisplay').textContent = username;
document.getElementById('roleDisplay').textContent = mainRole;
document.getElementById('userAvatar').textContent = username.charAt(0).toUpperCase();

// 3. Sistema de Permisos y Roles (Almacenado localmente)
const DEFAULT_PERMISSIONS = {
    'Root': { name: 'Root', description: 'Super usuario con todos los privilegios.', ver_espacios: true, editar_estados: true, administrar_roles: true, usersCount: 1 },
    'Administrador': { name: 'Administrador', description: 'Rol con acceso total al sistema.', ver_espacios: true, editar_estados: true, administrar_roles: false, usersCount: 2 },
    'Cliente': { name: 'Cliente', description: 'Rol asignado para los clientes del parqueadero.', ver_espacios: true, editar_estados: false, administrar_roles: false, usersCount: 15 }
};

const getRolesPermissions = () => {
    const saved = localStorage.getItem('roles_permissions');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            // Verificar si el esquema es antiguo (no tiene la propiedad name)
            let isOldSchema = false;
            Object.keys(parsed).forEach(k => {
                if (parsed[k] && typeof parsed[k] === 'object' && !parsed[k].name) {
                    isOldSchema = true;
                }
            });
            if (!isOldSchema) {
                return parsed;
            }
            console.warn("Esquema antiguo detectado en localStorage. Migrando a esquema nuevo...");
            // Migrar manteniendo los permisos previos pero agregando name y descripción por defecto
            const migrated = {};
            Object.keys(parsed).forEach(k => {
                migrated[k] = {
                    name: DEFAULT_PERMISSIONS[k] ? DEFAULT_PERMISSIONS[k].name : k,
                    description: DEFAULT_PERMISSIONS[k] ? DEFAULT_PERMISSIONS[k].description : 'Rol personalizado creado por usuario',
                    ver_espacios: !!parsed[k].ver_espacios,
                    editar_estados: !!parsed[k].editar_estados,
                    administrar_roles: !!parsed[k].administrar_roles,
                    usersCount: DEFAULT_PERMISSIONS[k] ? DEFAULT_PERMISSIONS[k].usersCount : 0
                };
            });
            localStorage.setItem('roles_permissions', JSON.stringify(migrated));
            return migrated;
        } catch (e) {
            console.error("Error al leer permisos de localStorage:", e);
        }
    }
    localStorage.setItem('roles_permissions', JSON.stringify(DEFAULT_PERMISSIONS));
    return DEFAULT_PERMISSIONS;
};

let currentPermissions = getRolesPermissions();

const hasPermission = (role, permission) => {
    if (!currentPermissions[role]) {
        return false;
    }
    return !!currentPermissions[role][permission];
};

// 4. Controladores de Vistas y Pestañas
const navDashboard = document.getElementById('navDashboard');
const navRoles = document.getElementById('navRoles');
const tabDashboardContent = document.getElementById('tabDashboardContent');
const tabRolesContent = document.getElementById('tabRolesContent');
const currentViewTitle = document.getElementById('currentViewTitle');
const permissionAlert = document.getElementById('permissionAlert');
const permissionAlertMessage = document.getElementById('permissionAlertMessage');

const showPermissionAlert = (msg) => {
    permissionAlertMessage.textContent = msg;
    permissionAlert.classList.remove('hidden');
    setTimeout(() => {
        permissionAlert.classList.add('hidden');
    }, 5000);
};

const activeTabClass = "bg-on-primary-fixed-variant text-on-primary rounded-lg mx-2 flex items-center gap-3 px-4 py-3 scale-98 transition-all font-label-md text-label-md text-left";
const inactiveTabClass = "text-primary-fixed-dim hover:text-on-primary mx-2 flex items-center gap-3 px-4 py-3 hover:bg-on-primary-fixed-variant/50 transition-colors duration-200 font-label-md text-label-md text-left";

// Configurar navegación de pestañas
navDashboard.addEventListener('click', () => {
    tabDashboardContent.classList.remove('hidden');
    tabDashboardContent.classList.add('block');
    tabRolesContent.classList.remove('block');
    tabRolesContent.classList.add('hidden');
    currentViewTitle.textContent = "Vista Parqueadero";

    navDashboard.className = activeTabClass;
    navRoles.className = inactiveTabClass;
});

// Guardar acceso a la pestaña Roles por seguridad
navRoles.addEventListener('click', () => {
    if (!hasPermission(mainRole, 'administrar_roles')) {
        showPermissionAlert("Acceso denegado: Tu rol no tiene permisos para ver o administrar roles.");
        return;
    }
    tabRolesContent.classList.remove('hidden');
    tabRolesContent.classList.add('block');
    tabDashboardContent.classList.remove('block');
    tabDashboardContent.classList.add('hidden');
    currentViewTitle.textContent = "Roles y Permisos";

    navRoles.className = activeTabClass;
    navDashboard.className = inactiveTabClass;
    
    renderRolesTable();
    updateBentoStats();
});

// Mostrar el botón si tiene permisos
if (hasPermission(mainRole, 'administrar_roles')) {
    navRoles.classList.remove('hidden');
}

// Guardia activa para vigilar manipulación manual del DOM
const enforceRouteSecurity = () => {
    if (tabRolesContent && !tabRolesContent.classList.contains('hidden')) {
        if (!hasPermission(mainRole, 'administrar_roles')) {
            console.warn("Intento de acceso no autorizado a Roles detectado. Revocando...");
            tabRolesContent.className = "hidden";
            tabDashboardContent.className = "block space-y-8 animate-fade-in";
            navDashboard.className = activeTabClass;
            navRoles.className = "hidden";
            currentViewTitle.textContent = "Vista Parqueadero";
            showPermissionAlert("Alerta de Seguridad: Acceso no autorizado bloqueado.");
        }
    }
};

// Observar cualquier cambio de clase o eliminación del atributo hidden en la pestaña de roles
const securityObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class' || mutation.attributeName === 'style') {
            enforceRouteSecurity();
        }
    });
});

if (tabRolesContent) {
    securityObserver.observe(tabRolesContent, { attributes: true });
}

// 5. Gestión del Panel Deslizable (Slide-over Panel)
const sidePanelEdit = document.getElementById('side-panel-edit');
const panelBackdrop = document.getElementById('panel-backdrop');
const panelContent = document.getElementById('panel-content');
const panelTitle = document.getElementById('panel-title');
const btnCloseEditPanel = document.getElementById('btnCloseEditPanel');
const btnCancelRoleEdit = document.getElementById('btnCancelRoleEdit');
const editRoleForm = document.getElementById('editRoleForm');

const editRoleId = document.getElementById('editRoleId');
const editRoleNameInput = document.getElementById('editRoleNameInput');
const editRoleDescriptionInput = document.getElementById('editRoleDescriptionInput');
const permissionsChecklistContainer = document.getElementById('permissionsChecklistContainer');

const openEditPanel = (roleKey) => {
    if (roleKey === 'Root') {
        showPermissionAlert("El rol Root es de sistema y no puede ser editado.");
        return;
    }
    const roleData = currentPermissions[roleKey];
    if (!roleData) return;

    editRoleId.value = roleKey;
    editRoleNameInput.value = roleData.name;
    editRoleDescriptionInput.value = roleData.description || '';
    panelTitle.textContent = `Editar Rol: ${roleData.name}`;

    // Renderizar checklist de permisos
    permissionsChecklistContainer.innerHTML = '';
    
    const permissionItems = [
        { key: 'ver_espacios', label: 'Ver Disponibilidad', desc: 'Acceso a vista de mapa de parqueadero', icon: 'visibility' },
        { key: 'editar_estados', label: 'Editar Estado de Plazas', desc: 'Modificación del estado de plazas (Disponible/Ocupado/Reservado)', icon: 'payments' },
        { key: 'administrar_roles', label: 'Gestionar Roles', desc: 'Crear, editar o configurar permisos de roles', icon: 'manage_accounts' }
    ];

    permissionItems.forEach(item => {
        const isChecked = roleData[item.key] ? 'checked' : '';
        // Evitar que el Root se autobloquee de la administración
        const isDisabled = (roleKey === 'Root' && item.key === 'administrar_roles') ? 'disabled' : '';

        permissionsChecklistContainer.innerHTML += `
            <label class="flex items-center justify-between p-4 border border-outline-variant rounded-xl hover:bg-surface-bright cursor-pointer transition-colors">
                <div class="flex items-center gap-3">
                    <span class="material-symbols-outlined text-on-surface-variant">${item.icon}</span>
                    <div class="flex flex-col">
                        <span class="font-label-md text-label-md text-on-surface">${item.label}</span>
                        <span class="text-[11px] text-on-surface-variant">${item.desc}</span>
                    </div>
                </div>
                <input type="checkbox" name="perm_${item.key}" ${isChecked} ${isDisabled} class="rounded text-primary focus:ring-primary w-5 h-5 cursor-pointer"/>
            </label>
        `;
    });

    // Animar apertura
    sidePanelEdit.classList.remove('invisible');
    setTimeout(() => {
        panelContent.classList.remove('translate-x-full');
        panelBackdrop.classList.add('opacity-100');
    }, 10);
};

const closeEditPanel = () => {
    panelContent.classList.add('translate-x-full');
    panelBackdrop.classList.remove('opacity-100');
    setTimeout(() => {
        sidePanelEdit.classList.add('invisible');
    }, 300);
};

// Exponer la función openEditPanel globalmente para que funcione con los clics de la tabla
window.openEditPanel = openEditPanel;

btnCloseEditPanel.addEventListener('click', closeEditPanel);
btnCancelRoleEdit.addEventListener('click', closeEditPanel);
panelBackdrop.addEventListener('click', closeEditPanel);

// Guardar Privilegios del Rol
editRoleForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const roleKey = editRoleId.value;
    const roleData = currentPermissions[roleKey];
    if (!roleData) return;

    // Actualizar nombre y descripción
    roleData.name = editRoleNameInput.value.trim();
    roleData.description = editRoleDescriptionInput.value.trim();

    // Actualizar checkbox de permisos
    ['ver_espacios', 'editar_estados', 'administrar_roles'].forEach(permKey => {
        if (roleKey === 'Root' && permKey === 'administrar_roles') {
            roleData[permKey] = true;
            return;
        }
        const checkbox = editRoleForm.querySelector(`[name="perm_${permKey}"]`);
        roleData[permKey] = checkbox ? checkbox.checked : false;
    });

    // Guardar
    currentPermissions[roleKey] = roleData;
    localStorage.setItem('roles_permissions', JSON.stringify(currentPermissions));

    // Refrescar vistas
    renderRolesTable();
    updateBentoStats();
    closeEditPanel();

    // Alerta de éxito
    const alert = document.getElementById('saveSuccessAlert');
    alert.classList.remove('hidden');
    setTimeout(() => {
        alert.classList.add('hidden');
        // Si el usuario actual editó su propio rol, recargar para aplicar cambios inmediatamente
        if (roleKey === mainRole) {
            window.location.reload();
        }
    }, 1500);
});

// 6. Inyección Dinámica y Búsqueda en la Tabla de Roles
const rolesTableBody = document.getElementById('rolesTableBody');
const roleSearchInput = document.getElementById('roleSearchInput');

const renderRolesTable = (filterText = '') => {
    rolesTableBody.innerHTML = '';
    const query = filterText.toLowerCase().trim();

    Object.keys(currentPermissions).forEach((roleKey) => {
        const roleData = currentPermissions[roleKey];
        if (query && !roleData.name.toLowerCase().includes(query) && !roleData.description.toLowerCase().includes(query)) {
            return; // Filtrar por búsqueda
        }

        // Armar chips de permisos activos
        let chipsHtml = '';
        if (roleData.ver_espacios) {
            chipsHtml += `<span class="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-[11px] font-bold mr-1">VER DISPONIBILIDAD</span>`;
        }
        if (roleData.editar_estados) {
            chipsHtml += `<span class="px-3 py-1 rounded-full bg-secondary-container/30 text-on-secondary-container text-[11px] font-bold mr-1">EDITAR ESTADOS</span>`;
        }
        if (roleData.administrar_roles) {
            chipsHtml += `<span class="px-3 py-1 rounded-full bg-error-container/20 text-on-error-container text-[11px] font-bold">ADMINISTRAR ROLES</span>`;
        }
        if (!chipsHtml) {
            chipsHtml = `<span class="text-xs text-slate-400 italic">Sin Permisos</span>`;
        }

        rolesTableBody.innerHTML += `
            <tr class="hover:bg-surface-bright transition-colors">
                <td class="px-6 py-5">
                    <div class="flex flex-col">
                        <span class="font-headline-md text-headline-md text-primary">${roleData.name}</span>
                        <span class="font-body-md text-body-md text-on-surface-variant mt-0.5">${roleData.description || 'Sin descripción'}</span>
                    </div>
                </td>
                <td class="px-6 py-5">
                    <div class="flex flex-wrap gap-2">
                        ${chipsHtml}
                    </div>
                </td>
                <td class="px-6 py-5">
                    <span class="font-body-md text-body-md">${roleData.usersCount || 0} Usuarios</span>
                </td>
                <td class="px-6 py-5">
                    ${roleKey === 'Root' 
                        ? `<span class="text-slate-400 font-label-md text-label-md flex items-center gap-1 cursor-not-allowed select-none" title="El rol Root es de sistema e ineditable">
                             <span class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' 1;">lock</span>
                             Ineditable
                           </span>`
                        : `<button class="text-primary hover:underline font-label-md text-label-md flex items-center gap-1" onclick="openEditPanel('${roleKey}')">
                             <span class="material-symbols-outlined text-[18px]">edit</span>
                             Editar
                           </button>`
                    }
                </td>
            </tr>
        `;
    });

    if (rolesTableBody.children.length === 0) {
        rolesTableBody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center py-10 text-slate-400 italic">No se encontraron roles correspondientes.</td>
            </tr>
        `;
    }
};

roleSearchInput.addEventListener('input', (e) => {
    renderRolesTable(e.target.value);
});

// 7. Modal: Crear Nuevo Rol
const modalNewRole = document.getElementById('modal-new-role');
const newRoleForm = document.getElementById('newRoleForm');
const btnCancelNewRole = document.getElementById('btnCancelNewRole');
const newRoleBackdrop = document.getElementById('newRoleBackdrop');

const newRoleNameInput = document.getElementById('newRoleNameInput');
const newRoleDescriptionInput = document.getElementById('newRoleDescriptionInput');

btnCancelNewRole.addEventListener('click', () => {
    modalNewRole.classList.add('hidden');
});
newRoleBackdrop.addEventListener('click', () => {
    modalNewRole.classList.add('hidden');
});

newRoleForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = newRoleNameInput.value.trim();
    const description = newRoleDescriptionInput.value.trim();

    // Clave interna del rol en localStorage
    const roleKey = name.replace(/\s+/g, '');
    if (currentPermissions[roleKey]) {
        alert("Ya existe un rol con ese nombre.");
        return;
    }

    // Insertar rol nuevo con permisos desactivados por defecto
    currentPermissions[roleKey] = {
        name: name,
        description: description,
        ver_espacios: false,
        editar_estados: false,
        administrar_roles: false,
        usersCount: 0
    };

    localStorage.setItem('roles_permissions', JSON.stringify(currentPermissions));
    
    newRoleNameInput.value = '';
    newRoleDescriptionInput.value = '';
    modalNewRole.classList.add('hidden');

    renderRolesTable();
    updateBentoStats();

    // Mostrar alerta de éxito
    const alert = document.getElementById('saveSuccessAlert');
    alert.classList.remove('hidden');
    setTimeout(() => alert.classList.add('hidden'), 2000);
});

// Actualizar KPIs de la pestaña de Roles
const updateBentoStats = () => {
    const totalRoles = Object.keys(currentPermissions).length;
    const activeUsers = Object.values(currentPermissions).reduce((sum, r) => sum + (r.usersCount || 0), 0);
    
    document.getElementById('bentoTotalRoles').textContent = totalRoles;
    document.getElementById('bentoActiveUsers').textContent = activeUsers;
};


// 8. Vista del Parqueadero: KPIs y Carga de Plazas
const container = document.getElementById('espaciosContainer');
const totalSpan = document.getElementById('totalEspacios');
const indicator = document.getElementById('indicator');
const statusText = document.getElementById('statusText');

const kpiTotal = document.getElementById('kpiTotal');
const kpiDisponibles = document.getElementById('kpiDisponibles');
const kpiOcupadas = document.getElementById('kpiOcupadas');
const kpiReservadas = document.getElementById('kpiReservadas');
const kpiPorcentaje = document.getElementById('kpiPorcentaje');
const kpiProgressBar = document.getElementById('kpiProgressBar');

// Modal de cambio de estado de plazas
const editSpaceModal = document.getElementById('editSpaceModal');
const editSpaceForm = document.getElementById('editSpaceForm');
const btnCancelEdit = document.getElementById('btnCancelEdit');
const modalSpaceId = document.getElementById('modalSpaceId');
const modalSpaceStatus = document.getElementById('modalSpaceStatus');
const modalSpaceDetails = document.getElementById('modalSpaceDetails');
const modalAlert = document.getElementById('modalAlert');
const btnSaveSpaceStatus = document.getElementById('btnSaveSpaceStatus');
const modalBtnText = document.getElementById('modalBtnText');
const modalBtnSpinner = document.getElementById('modalBtnSpinner');

const fetchEspacios = async () => {
    try {
        if (!hasPermission(mainRole, 'ver_espacios')) {
            container.innerHTML = `
                <div class="col-span-full text-center py-16 bg-white border border-outline-variant/30 rounded-xl shadow-sm p-8 text-gray-500">
                    <span class="material-symbols-outlined text-[48px] text-slate-400">block</span>
                    <p class="text-xl font-bold text-slate-700 mt-3">Acceso Denegado</p>
                    <p class="text-slate-400 text-sm mt-1">Tu rol no tiene privilegios para ver la distribución de espacios.</p>
                </div>
            `;
            totalSpan.textContent = 'Sin acceso';
            return null;
        }

        const response = await fetch(API_ESPACIOS, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            localStorage.clear();
            window.location.href = 'login.html';
            return null;
        }

        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener espacios:', error);
        return null;
    }
};

const renderizarEspacios = (espacios) => {
    if (!espacios || espacios.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-12 text-gray-400 bg-white border border-outline-variant/30 rounded-xl shadow-sm">
                <p class="text-lg">No hay espacios registrados</p>
            </div>
        `;
        totalSpan.textContent = '0';
        kpiTotal.textContent = '0';
        kpiDisponibles.textContent = '0';
        kpiOcupadas.textContent = '0';
        kpiReservadas.textContent = '0';
        kpiPorcentaje.textContent = '0%';
        kpiProgressBar.style.width = '0%';
        return;
    }

    // Calcular KPIs
    const total = espacios.length;
    const disponibles = espacios.filter(e => e.estado === 'DISPONIBLE').length;
    const ocupadas = espacios.filter(e => e.estado === 'OCUPADO').length;
    const reservadas = espacios.filter(e => e.estado === 'RESERVADO').length;
    const porcentaje = total > 0 ? Math.round(((ocupadas + reservadas) / total) * 100) : 0;

    // Pintar KPIs
    kpiTotal.textContent = total;
    kpiDisponibles.textContent = disponibles;
    kpiOcupadas.textContent = ocupadas;
    kpiReservadas.textContent = reservadas;
    kpiPorcentaje.textContent = `${porcentaje}%`;
    kpiProgressBar.style.width = `${porcentaje}%`;

    // Cambiar color de la barra de progreso
    if (porcentaje >= 85) {
        kpiProgressBar.className = "bg-error h-2 rounded-full transition-all duration-500";
    } else if (porcentaje >= 60) {
        kpiProgressBar.className = "bg-amber-500 h-2 rounded-full transition-all duration-500";
    } else {
        kpiProgressBar.className = "bg-secondary h-2 rounded-full transition-all duration-500";
    }

    // Renderizar tarjetas de espacio
    const canEdit = hasPermission(mainRole, 'editar_estados');
    const html = espacios.map((esp) => {
        const estado = esp.estado || 'DISPONIBLE';
        
        let stateBadgeColor = '';
        let pulseColor = '';
        let borderHoverColor = '';

        if (estado === 'DISPONIBLE') {
            stateBadgeColor = 'bg-secondary/10 text-secondary border-secondary/20';
            pulseColor = 'bg-secondary pulse-green';
            borderHoverColor = 'hover:border-secondary/40';
        } else if (estado === 'OCUPADO') {
            stateBadgeColor = 'bg-error/10 text-error border-error/20';
            pulseColor = 'bg-error pulse-red';
            borderHoverColor = 'hover:border-error/40';
        } else {
            stateBadgeColor = 'bg-amber-500/10 text-amber-600 border-amber-500/20';
            pulseColor = 'bg-amber-500 pulse-yellow';
            borderHoverColor = 'hover:border-amber-500/40';
        }

        const cursorClass = canEdit ? 'cursor-pointer hover:shadow-lg transition-all' : 'cursor-default';
        const interactiveTitle = canEdit ? 'title="Haz clic para cambiar el estado de esta plaza"' : '';

        return `
            <div 
                class="bg-white border border-outline-variant/30 rounded-xl p-6 flex flex-col justify-between h-44 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] ${cursorClass} ${borderHoverColor}" 
                data-id="${esp.id}"
                data-nombre="${esp.name || esp.nombre || 'Sin Nombre'}"
                data-estado="${estado}"
                ${interactiveTitle}
            >
                <div class="flex items-start justify-between">
                    <div>
                        <div class="font-headline-md text-headline-md text-primary line-clamp-1">${esp.name || esp.nombre || 'Sin nombre'}</div>
                        <div class="text-xs text-on-surface-variant mt-0.5 font-medium uppercase tracking-wider">Zona: ${esp.nombreZona || 'N/A'}</div>
                        <div class="text-xs text-on-surface-variant font-medium">Tipo: ${esp.type || esp.tipo || 'N/A'}</div>
                    </div>
                    <!-- Indicador parpadeante -->
                    <span class="w-3.5 h-3.5 rounded-full flex-shrink-0 ${pulseColor}"></span>
                </div>
                
                <div class="flex items-center justify-between border-t border-outline-variant/20 pt-3 mt-3">
                    <span class="px-3 py-1 text-[11px] font-bold rounded-full border ${stateBadgeColor}">
                        ${estado}
                    </span>
                    <span class="text-[10px] text-outline font-mono">ID: ${esp.id.slice(0, 8)}</span>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = html;
    totalSpan.textContent = total;

    // Listener de clics si el usuario tiene privilegios de edición
    if (canEdit) {
        document.querySelectorAll('#espaciosContainer > div').forEach(card => {
            card.addEventListener('click', () => {
                const id = card.getAttribute('data-id');
                const nombre = card.getAttribute('data-nombre');
                const estado = card.getAttribute('data-estado');
                openEditModal(id, nombre, estado);
            });
        });
    }
};

const setConnectionStatus = (connected) => {
    if (connected) {
        indicator.className = 'w-2 h-2 rounded-full bg-secondary animate-pulse';
        statusText.textContent = 'Conectado';
        document.getElementById('statusConexion').className = 'flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary-container/20 text-on-secondary-container';
    } else {
        indicator.className = 'w-2 h-2 rounded-full bg-error animate-pulse';
        statusText.textContent = 'Desconectado';
        document.getElementById('statusConexion').className = 'flex items-center gap-2 px-3 py-1.5 rounded-full bg-error-container/25 text-on-error-container';
    }
};

const cargarEspacios = async () => {
    const data = await fetchEspacios();
    if (data) {
        renderizarEspacios(data);
        setConnectionStatus(true);
    } else {
        setConnectionStatus(false);
    }
};

// 9. Modal de Edición de Plaza (Espacio)
const openEditModal = (id, nombre, estado) => {
    if (!hasPermission(mainRole, 'editar_estados')) {
        showPermissionAlert("Acceso denegado: Tu rol no tiene permisos para editar plazas.");
        return;
    }
    modalSpaceId.value = id;
    modalSpaceStatus.value = estado;
    modalSpaceDetails.textContent = `Plaza: ${nombre} | ID: ${id}`;
    modalAlert.className = 'hidden p-3 rounded-lg text-xs';
    modalAlert.textContent = '';
    
    // Restaurar estado del botón
    btnSaveSpaceStatus.disabled = false;
    modalBtnText.textContent = 'Confirmar';
    modalBtnSpinner.classList.add('hidden');

    editSpaceModal.classList.remove('hidden');
};

const closeEditModal = () => {
    editSpaceModal.classList.add('hidden');
};

btnCancelEdit.addEventListener('click', closeEditModal);

editSpaceForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!hasPermission(mainRole, 'editar_estados')) {
        showPermissionAlert("No tienes permisos para cambiar el estado de las plazas.");
        closeEditModal();
        return;
    }

    const id = modalSpaceId.value;
    const nuevoEstado = modalSpaceStatus.value;

    btnSaveSpaceStatus.disabled = true;
    modalBtnText.textContent = 'Guardando...';
    modalBtnSpinner.classList.remove('hidden');
    modalAlert.classList.add('hidden');

    try {
        const response = await fetch(`${API_ESTADO_CAMBIAR}/${id}/estado/${nuevoEstado}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            localStorage.clear();
            window.location.href = 'login.html';
            return;
        }

        if (!response.ok) {
            throw new Error(`Error en el servidor: código ${response.status}`);
        }

        modalAlert.className = 'p-3 rounded-xl text-xs bg-green-50 border border-green-200 text-green-700';
        modalAlert.textContent = '¡Estado actualizado con éxito!';
        modalAlert.classList.remove('hidden');

        await cargarEspacios();
        setTimeout(closeEditModal, 1200);

    } catch (error) {
        console.error('Error al actualizar estado:', error);
        modalAlert.className = 'p-3 rounded-xl text-xs bg-red-50 border border-red-200 text-red-700';
        modalAlert.textContent = error.message || 'No se pudo guardar el cambio de estado.';
        modalAlert.classList.remove('hidden');
        
        btnSaveSpaceStatus.disabled = false;
        modalBtnText.textContent = 'Confirmar';
        modalBtnSpinner.classList.add('hidden');
    }
});

editSpaceModal.addEventListener('click', (e) => {
    if (e.target === editSpaceModal) {
        closeEditModal();
    }
});

// 10. Cerrar Sesión
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_type');
    window.location.href = 'login.html';
});

// 11. Conectar SSE (Tiempo Real)
const conectarSSE = () => {
    if (!hasPermission(mainRole, 'ver_espacios')) return null;

    const eventSource = new EventSource(SSE_URL);

    eventSource.onopen = () => {
        console.log('SSE: conexión establecida');
        setConnectionStatus(true);
    };

    const handleEvent = (event) => {
        try {
            const payload = JSON.parse(event.data);
            console.log('SSE recibido:', payload);
            cargarEspacios();
        } catch (e) {
            console.error('Error al parsear evento SSE:', e);
        }
    };

    eventSource.onmessage = handleEvent;
    eventSource.addEventListener('espacios', handleEvent);

    eventSource.onerror = (error) => {
        console.error('SSE error:', error);
        setConnectionStatus(false);
        eventSource.close();
        setTimeout(conectarSSE, 5000);
    };

    return eventSource;
};

// 12. Inicialización
(async () => {
    await cargarEspacios();
    conectarSSE();
    setInterval(cargarEspacios, 30000);
})();
