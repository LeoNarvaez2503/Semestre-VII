const Autor = require('../models/Autor');

const findAll = async (req,res)=>{
    try{
        const autores = await Autor.findAll();
        res.json(autores);
    }catch(error){
        res.status(500).json({error: 'Error al obtener los autores.'});
    }
}

const createAutor = async (req, res) => {
    try {
        const { nombres, apellidos, fecha_nacimiento, nacionalidad, correo_electronico } = req.body;
        const nuevoAutor = await Autor.createAutor(nombres, apellidos, fecha_nacimiento, nacionalidad, correo_electronico);
        res.status(201).json(nuevoAutor);
    } catch (error) {
        console.error("Error en createAutor:", error.message);
        res.status(500).json({ error: 'Error al crear el autor.' });
    }
}

const updateAutor = async (req,res) => {
    try{
        const {id} = req.params;
        const resultado = await Autor.updateAutor(id, req.body);
    }catch(error){
        res.status(500).json({error: 'Error al actualizar el autor.'});
    }
}
const deleteAutor = async(req,res) => {
    try{
        const {id} = req.params;
        const resultado = await Autor.deleteAutor(id);
    }catch(error){
        res.status(500).json({error: 'Error al eliminar el autor.'});
    }
}

const searchAutor = async (req,res) => {
    try{
        const palabra = req.query.autor;
        if (!palabra || palabra.trim() === '') {
            return res.status(400).json({ 
                error: 'Debes enviar un término de búsqueda. Ejemplo: ?autor=garcia' 
            });
        }
        const resultado = await Autor.searchAutor(palabra);
        res.status(200).json(resultado);
    } catch (error) {
        console.error("Error ejecutando searchAutor en el Controller:", error.message); 
        res.status(500).json({ error: 'Error interno del servidor al buscar el autor.', details: error.message });
    }
}
module.exports = {createAutor,findAll,updateAutor,deleteAutor,searchAutor};