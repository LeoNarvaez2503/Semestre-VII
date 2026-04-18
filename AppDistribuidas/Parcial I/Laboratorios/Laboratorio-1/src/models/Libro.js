const res = require('express/lib/response');
const db = require('../config/db');

const Libro = {
    getAll : async () => {
        const [rows] = await db.query('CALL verLibro()');
        return rows[0];
    },
    createBook: async (titulo, isbn, autor_id, anio_publicacion, edicion, idioma) => {
    try {
        const consulta = 'CALL crearLibro(?,?,?,?,?,?)';
        const values = [titulo, isbn, autor_id, anio_publicacion, edicion, idioma];
        const [result] = await db.query(consulta, values);
        const datosGenerados = result[0][0];

        if (!datosGenerados) {
            throw new Error("El procedimiento almacenado no devolvió datos.");
        }

        return {
            message: 'Libro creado exitosamente',
            data: {
                id: datosGenerados.nuevo_libro_id || datosGenerados.id, 
                total: datosGenerados.total_libros,
                titulo,
                isbn,
                autor_id,
                anio_publicacion,
                edicion,
                idioma
            }
        };
    } catch (error) {
        console.error("Error en el modelo Libro:", error.message);
        throw error; 
    }
    },
    updateBook: async (titulo, isbn, autor_id, anio_publicacion, edicion, idioma, id) => {
        const consulta = `CALL actualizarLibro(?,?,?,?,?,?,?)`;
        const values = [id, titulo, isbn, autor_id, anio_publicacion, edicion, idioma];
        await db.query(consulta, values);
        const resultado = rows[0][0];
        if (resultado.length === 0) {
            throw new Error('No se encontró el libro o no hubo cambios');
        }

        return {
            message: 'Libro actualizado exitosamente',
            data: { id, titulo, isbn, autor_id, anio_publicacion, edicion, idioma }
        };
    },
    deleteBook: async (id) => {
        const consulta = 'CALL eliminarLibro(?)';
        const [rows] = await db.query(consulta, [id]);
        const libroEliminado = rows[0];
        if (libroEliminado.length === 0) {
            throw new Error('No se encontró el libro o ya fue eliminado');
        }
        const datos = libroEliminado[0];
        return { 
            message: `Libro con id ${id} eliminado exitosamente`,
            data: datos  
        };
    },
    
}
module.exports = Libro;