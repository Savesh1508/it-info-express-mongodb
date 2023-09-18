const { Router } = require('express');
const {
    getAllDictionarys,
    getDictionaryById,
    getDictionarysByLetter,
    getDictionarysByTerm,
    addDictionary,
    updateDictionaryById,
    deleteDictionaryById
} = require('../controllers/dictionary.controllers.js');

const router = Router();

router.get('/', getAllDictionarys);
router.get('/:id', getDictionaryById);
router.get('/letter/:letter', getDictionarysByLetter);
router.get('/term/:term', getDictionarysByTerm);
router.post('/', addDictionary);
router.put('/:id', updateDictionaryById);
router.delete('/:id', deleteDictionaryById);

module.exports = router