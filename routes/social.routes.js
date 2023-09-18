const { Router } = require('express');
const {
    getAllSocials,
    getSocialById,
    addSocial,
    updateSocialById,
    deleteSocialById
} = require('../controllers/social.controllers.js');

const router = Router();

router.get('/', getAllSocials);
router.get('/:id', getSocialById);
router.post('/', addSocial);
router.put('/:id', updateSocialById);
router.delete('/:id', deleteSocialById);

module.exports = router