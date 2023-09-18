const { Router } = require('express');
const {
    getAllSynonyms,
    getSynonymById,
    addSynonym,
    updateSynonymById,
    deleteSynonymById
} = require('../controllers/synonym.controllers.js');

const router = Router();

router.get('/', getAllSynonyms);
router.get('/:id', getSynonymById);
router.post('/', addSynonym);
router.put('/:id', updateSynonymById);
router.delete('/:id', deleteSynonymById);

module.exports = router