const express = require('express');
const router = express.Router();
const{
    findAll,
    createBook,
    updateBook,
    deleteBook
} = require('../controllers/libroController');

router.get('/',findAll);
router.post('/',createBook);
router.put('/:id',updateBook);
router.delete('/:id',deleteBook);

module.exports = router;