const Dictionary = require('../models/Dictionary.js');
const { errorHandler }= require('../helpers/error_handler.js');
const mongoose = require('mongoose');

// GET ALL
const getAllDictionarys = async(req, res) => {
    try {
        const dictionarys = await Dictionary.find({});

        if (!dictionarys) {
            return res.status(404).send({"message": "Dictionary not found!"});
        }

        if(dictionarys.length === 0){
            return res.status(200).send({"message": "Dictionary is empty"});
        }

        res.json({ dictionarys });
    } catch(error) {
        errorHandler(res, error);
    }
}

// GET BY ID
const getDictionaryById = async(req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send({"message": "Incorrect ID!"});
        }

        const dictionary = await Dictionary.findOne({"_id": req.params.id});
        if (!dictionary) {
            return res.status(404).send({"message": "There is no dictionary with such ID!"});
        }

        res.json(dictionary);
    } catch(error) {
        errorHandler(res, error);
    }
}

// GET BY LETTER
const getDictionarysByLetter = async(req, res) => {
    try {
        const dictionarys = await Dictionary.find({}).byLetter(req.params.letter);
        // const dictionarys = await Dictionary.findByLetter(req.params.letter);

        if(dictionarys.length === 0) {
            return res.status(404).send({"message": "There is no dictionary which starts with this letter!"});
        }

        res.json({ dictionarys });
    } catch(error) {
        errorHandler(res, error);
    }
}

// GET BY TERM
const getDictionarysByTerm = async(req, res) => {
    try {
        const dictionarys = await Dictionary.find({}).byTerm(req.params.term);
        // const dictionarys = await Dictionary.findByTerm(req.params.term);

        if (dictionarys.length === 0) {
            return res.status(404).send({"message": "There is no dictionary which starts with this letter!"});
        }

        res.json(dictionarys);
    } catch(error) {
        errorHandler(res, error);
    }
}

// CREATE
const addDictionary = async(req, res) => {
    try {
        const { term } = (req.body)
        const letter = term.slice(0, 1).toUpperCase()

        if (!term){
            return res.status(400).send({"message": "You should enter all required data!"});
        }

        const newDictionary = await Dictionary({
            term,
            letter
        })

        await newDictionary.save();
        return res.status(201).send({"message": "Dictionary succesfully added!"})
    } catch(error) {
        errorHandler(res, error);
    }
}

// UPDATE BY ID
const updateDictionaryById = async(req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send({"message": "Incorrect ID!"});
        }

        const { term } = req.body
        const letter = term.slice(0,1).toUpperCase()

        if (!term){
            return res.status(400).send({"message": "You should enter all required data!"});
        }

        const updateResult = await Dictionary.updateOne(
            {
                "_id": req.params.id
            },
            {
                $set:{
                    term,
                    letter
                }
            }
        )

        if (updateResult.modifiedCount > 0){
            return res.status(400).send({"message": "Dictionary data's successfully changed!"});
        } else if (updateResult.matchedCount === 0){
            return res.status(404).send({"message": "There is no dictionary with such ID!"});
        }
    } catch(error) {
        errorHandler(res, error);
    }
}

// DELETE BY ID
const deleteDictionaryById = async(req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send({"message": "Incorrect ID!"});
        }

        const deleteResult = await Dictionary.deleteOne(
            {
                "_id": req.params.id
            }
        )

        if (deleteResult.deletedCount > 0) {
            return res.status(400).send({"message": "Dictionary data's successfully deleted!"});
        } else if (deleteResult.deletedCount === 0) {
            return res.status(404).send({"message": "There is no dictionary with such ID!"});
        }
    } catch(error) {
        errorHandler(res, error);
    }
}

module.exports = {
    getAllDictionarys,
    getDictionaryById,
    getDictionarysByLetter,
    getDictionarysByTerm,
    addDictionary,
    updateDictionaryById,
    deleteDictionaryById
}