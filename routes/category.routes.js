const { Router } = require('express');
const {
    getAllCategorys,
    getCategoryById,
    getCategoryByName,
    addCategory,
    updateCategoryById,
    deleteCategoryById
} = require('../controllers/category.controllers.js');

const router = Router();

router.get('/', getAllCategorys);
router.get('/:id', getCategoryById);
router.get('/name/:name', getCategoryByName);
router.post('/', addCategory);
router.put('/:id', updateCategoryById);
router.delete('/:id', deleteCategoryById);

module.exports = router