const Synonym = require('../models/Synonym.js');
const { errorHandler }= require('../helpers/error_handler.js');
const mongoose = require('mongoose');

// GET ALL
const getAllSynonyms = async(req, res) => {
    try {
        const synonyms = await Synonym.find({});

        if (!synonyms) {Category
            return res.status(404).send({"message": "Synonym not found!"});
        }

        if(synonyms.length === 0){
            return res.status(200).send({"message": "Synonym is empty"});
        }

        res.json({ synonyms });
    } catch(error) {
        errorHandler(res, error);
    }
}

// GET BY ID
const getSynonymById = async(req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send({"message": "Incorrect ID!"});
        }

        const synonym = await Synonym.findOne({"_id": req.params.id});
        if (!synonym) {
            return res.status(404).send({"message": "There is no synonym with such ID!"});
        }

        res.json(synonym);
    } catch(error) {
        errorHandler(res, error);
    }
}

// CREATE
const addSynonym = async(req, res) => {
    try {
        const { desc_id, dict_id } = req.body

        if (!desc_id || !dict_id){
            return res.status(400).send({"message": "You should enter all required data!"});
        }

        const newSynonym = await Synonym({
            desc_id,
            dict_id,
        })

        await newSynonym.save();
        return res.status(201).send({"message": "Synonym succesfully added!"})
    } catch(error) {
        errorHandler(res, error);
    }
}

// UPDATE BY ID
const updateSynonymById = async(req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send({"message": "Incorrect ID!"});
        }

        const { desc_id, dict_id } = req.body

        const updateResult = await Synonym.updateOne(
            {
                "_id": req.params.id
            },
            {
                $set:{
                    desc_id,
                    dict_id,
                }
            }
        )

        if (updateResult.modifiedCount > 0){
            return res.status(400).send({"message": "Synonym data's successfully changed!"});
        } else if (updateResult.matchedCount === 0){
            return res.status(404).send({"message": "There is no synonym with such ID!"});
        }


    } catch(error) {
        errorHandler(res, error);
    }
}

// DELETE BY ID
const deleteSynonymById = async(req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send({"message": "Incorrect ID!"});
        }

        const deleteResult = await Synonym.deleteOne(
            {
                "_id": req.params.id
            }
        )

        if (deleteResult.deletedCount > 0) {
            return res.status(400).send({"message": "Synonym data's successfully deleted!"});
        } else if (deleteResult.deletedCount === 0) {
            return res.status(404).send({"message": "There is no synonym with such ID!"});
        }
    } catch(error) {
        errorHandler(res, error);
    }
}

module.exports = {
    getAllSynonyms,
    getSynonymById,
    addSynonym,
    updateSynonymById,
    deleteSynonymById
}