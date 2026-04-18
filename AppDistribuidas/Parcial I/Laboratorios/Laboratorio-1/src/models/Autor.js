const db = require('../config/db');

const Autor = {
    findAll: async () => {
        const [rows] = await db.query('SELECT * FROM autor');
        return rows;
    },
    createAutor: async (nombres, apellidos, fecha_nacimiento, nacionalidad, correo_electronico) => {
            const consulta = 'INSERT INTO autor(nombres,apellidos,fecha_nacimiento,nacionalidad,correo_electronico) VALUES (?,?,?,?,?)'
            const values = [nombres,apellidos,fecha_nacimiento,nacionalidad,correo_electronico];
            const [result] = await db.query(consulta,values);

            return {
                message: 'Autor creado exitosamente',
                data:{
                    id: result.insertId, 
                    nombre: nombres, 
                    apellidos: apellidos, 
                    fecha_nacimiento: fecha_nacimiento, 
                    nacionalidad: nacionalidad, 
                    correo_electronico: correo_electronico
                }
            };
        },
    updateAutor: async (nombres, apellidos, fecha_nacimiento, nacionalidad, correo_electronico,id) => {
        const consulta = `UPDATE autor 
                        SET nombres = ?, apellidos = ?, fecha_nacimiento = ?, nacionalidad = ?, correo_electronico = ? 
                        WHERE id = ?`;
        const values = [nombres,apellidos,fecha_nacimiento,nacionalidad,correo_electronico, id];
        await db.query(consulta,values);
        return{id, nombres, apellidos, fecha_nacimiento, nacionalidad, correo_electronico}
    },
    deleteAutor: async (id) => {
        const consulta = 'DELETE FROM autor WHERE id = ?';
        await db.query(consulta, [id]);
        return { message: `Autor con id ${id} eliminado exitosamente` };
    },
    searchAutor: async (autor) => {
        const palabra = `%${autor}%`;
        const consulta = `
            SELECT * FROM autor
            WHERE LOWER(nombres) LIKE LOWER(?)
            OR LOWER(apellidos) LIKE LOWER(?)
        `;
        const [rows] = await db.query(consulta, [palabra, palabra]);
        if (rows.length === 0) {
            return { message: `No se encontró ningún autor con el nombre ${autor}`, data: [] };
        }
        return {
            message: `Autores encontrados con el nombre ${autor}`,
            data: rows
        };
    }
}
module.exports= Autor;