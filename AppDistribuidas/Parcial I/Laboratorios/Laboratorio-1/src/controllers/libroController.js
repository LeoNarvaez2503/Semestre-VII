const Libro = require('../models/Libro');

const findAll = async (req,res)=>{
    try{
        const libros = await Libro.getAll();
        res.json(libros);
    }catch(error){
        res.status(500).json({error: 'Error al obtener los libros.'});
    }
}
const createBook = async (req,res) => {
    try{
    const { titulo, isbn, autor_id, anio_publicacion, edicion, idioma } = req.body;        
    const nuevoLibro = await Libro.createBook(titulo, isbn, autor_id, anio_publicacion, edicion, idioma );
    res.status(201).json(nuevoLibro);
    } catch(error){
        res.status(500).json({error: 'Error al crear el libro.'});
    }
}

const updateBook = async (req,res) => {
    try{
        const {id} = req.params;
        const resultado = await Libro.updateBook(id, req.body);
        res.json(resultado);
    }catch(error){
        res.status(500).json({error: 'Error al actualizar el libro.'});
    }
}
const deleteBook = async(req,res) => {
    try{
        const {id} = req.params;
        const resultado = await Libro.deleteBook(id);
        res.json(resultado);
    }catch(error){
        res.status(500).json({error: 'Error al eliminar el libro.'});
    }
}

module.exports = {createBook,findAll,updateBook,deleteBook};