const { Router } = require('express');
const {
    getAllDescriptions,
    getDescriptionById,
    addDescription,
    updateDescriptionById,
    deleteDescriptionById
} = require('../controllers/description.controllers.js');

const router = Router();

router.get('/', getAllDescriptions);
router.get('/:id', getDescriptionById);
router.post('/', addDescription);
router.put('/:id', updateDescriptionById);
router.delete('/:id', deleteDescriptionById);

module.exports = router