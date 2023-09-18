const Social = require('../models/Social.js');
const { errorHandler }= require('../helpers/error_handler.js');
const mongoose = require('mongoose');

// GET ALL
const getAllSocials = async(req, res) => {
    try {
        const socials = await Social.find({});

        if (!socials) {Category
            return res.status(404).send({"message": "Social not found!"});
        }

        if(socials.length === 0){
            return res.status(200).send({"message": "Social is empty"});
        }

        res.json({ socials });
    } catch(error) {
        errorHandler(res, error);
    }
}

// GET BY ID
const getSocialById = async(req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send({"message": "Incorrect ID!"});
        }

        const social = await Social.findOne({"_id": req.params.id});
        if (!social) {
            return res.status(404).send({"message": "There is no social with such ID!"});
        }

        res.json(social);
    } catch(error) {
        errorHandler(res, error);
    }
}

// CREATE
const addSocial = async(req, res) => {
    try {
        const { social_name, social_icon_file } = req.body

        if (!social_name || !social_icon_file){
            return res.status(400).send({"message": "You should enter all required data!"});
        }

        const existedSocial = await Social.findOne({"social_name": { $regex: social_name, $options: "i"}});

        if (existedSocial) {
            return res.status(400).send({"message": "This social already exists!"})
        }

        const newSocial = await Social({
            social_name,
            social_icon_file,
        })

        await newSocial.save();
        return res.status(201).send({"message": "Social succesfully added!"})
    } catch(error) {
        errorHandler(res, error);
    }
}

// UPDATE BY ID
const updateSocialById = async(req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send({"message": "Incorrect ID!"});
        }

        const { social_name, social_icon_file } = req.body

        const existedSocial = await Social.findOne({"social_name": { $regex: social_name, $options: "i"}});

        if (existedSocial) {
            return res.status(400).send({"message": "This social already exists!"})
        }

        const updateResult = await Social.updateOne(
            {
                "_id": req.params.id
            },
            {
                $set:{
                    social_name,
                    social_icon_file,
                }
            }
        )

        if (updateResult.modifiedCount > 0){
            return res.status(400).send({"message": "Social data's successfully changed!"});
        } else if (updateResult.matchedCount === 0){
            return res.status(404).send({"message": "There is no social with such ID!"});
        }


    } catch(error) {
        errorHandler(res, error);
    }
}

// DELETE BY ID
const deleteSocialById = async(req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send({"message": "Incorrect ID!"});
        }

        const deleteResult = await Social.deleteOne(
            {
                "_id": req.params.id
            }
        )

        if (deleteResult.deletedCount > 0) {
            return res.status(400).send({"message": "Social data's successfully deleted!"});
        } else if (deleteResult.deletedCount === 0) {
            return res.status(404).send({"message": "There is no social with such ID!"});
        }
    } catch(error) {
        errorHandler(res, error);
    }
}

module.exports = {
    getAllSocials,
    getSocialById,
    addSocial,
    updateSocialById,
    deleteSocialById
}