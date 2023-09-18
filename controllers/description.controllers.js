const Description = require('../models/Description.js');
const { errorHandler }= require('../helpers/error_handler.js');
const mongoose = require('mongoose');

// GET ALL
const getAllDescriptions = async(req, res) => {
    try {
        const descriptions = await Description.find({});

        if (!descriptions) {
            return res.status(404).send({"message": "Description not found!"});
        }

        if(descriptions.length === 0){
            return res.status(200).send({"message": "Description is empty"});
        }

        res.json({ descriptions });
    } catch(error) {
        errorHandler(res, error);
    }
}

// GET BY ID
const getDescriptionById = async(req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send({"message": "Incorrect ID!"});
        }

        const description = await Description.findOne({"_id": req.params.id});
        if (!description) {
            return res.status(404).send({"message": "There is no description with such ID!"});
        }

        res.json(description);
    } catch(error) {
        errorHandler(res, error);
    }
}

// CREATE
const addDescription = async(req, res) => {
    try {
        const { category_id, description } = req.body

        if (!category_id || !description){
            return res.status(400).send({"message": "You should enter all required data!"});
        }

        const existedDescription = await Description.findOne({"category_id": category_id});

        if (existedDescription) {
            return res.status(400).send({"message": "Description for this category already exists!"})
        }

        const newDescription = await Description({
            category_id,
            description,
        })

        await newDescription.save();
        return res.status(201).send({"message": "Description succesfully added!"})
    } catch(error) {
        errorHandler(res, error);
    }
}

// UPDATE BY ID
const updateDescriptionById = async(req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send({"message": "Incorrect ID!"});
        }

        const { category_id, description } = req.body

        const existedDescription = await Description.findOne({"category_id": category_id});

        if (existedDescription) {
            return res.status(400).send({"message": "Description for this category already exists!"})
        }

        const updateResult = await Description.updateOne(
            {
                "_id": req.params.id
            },
            {
                $set:{
                    category_id,
                    description,
                }
            }
        )

        if (updateResult.modifiedCount > 0){
            return res.status(400).send({"message": "Description data's successfully changed!"});
        } else if (updateResult.matchedCount === 0){
            return res.status(404).send({"message": "There is no description with such ID!"});
        }


    } catch(error) {
        errorHandler(res, error);
    }
}

// DELETE BY ID
const deleteDescriptionById = async(req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send({"message": "Incorrect ID!"});
        }

        const deleteResult = await Description.deleteOne(
            {
                "_id": req.params.id
            }
        )

        if (deleteResult.deletedCount > 0) {
            return res.status(400).send({"message": "Description data's successfully deleted!"});
        } else if (deleteResult.deletedCount === 0) {
            return res.status(404).send({"message": "There is no description with such ID!"});
        }
    } catch(error) {
        errorHandler(res, error);
    }
}

module.exports = {
    getAllDescriptions,
    getDescriptionById,
    addDescription,
    updateDescriptionById,
    deleteDescriptionById
}