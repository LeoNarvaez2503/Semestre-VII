const express = require('express');
const router = express.Router();

// const autorController = require('../controllers/autorController');
// router.get('/autores',autorController.findAll);

const{
    findAll,
    createAutor,
    updateAutor,
    deleteAutor,
    searchAutor
} = require('../controllers/autorController');

router.get('/',findAll);
router.post('/',createAutor);
router.put('/:id',updateAutor);
router.delete('/:id',deleteAutor);
router.get('/search', searchAutor);

module.exports = router;