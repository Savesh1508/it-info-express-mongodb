const Category = require('../models/Category.js');
const { errorHandler }= require('../helpers/error_handler.js');
const mongoose = require('mongoose');
const { categoryValidation } = require('../validations/category.validations.js');

// GET ALL
const getAllCategorys = async(req, res) => {
    try {
        const categorys = await Category.find({});

        if (!categorys) {
            return res.status(404).send({"message": "Category not found!"});
        }

        if(categorys.length === 0){
            return res.status(200).send({"message": "Category is empty"});
        }

        res.json({ categorys });
    } catch(error) {
        errorHandler(res, error);
    }
}

// GET BY ID
const getCategoryById = async(req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send({"message": "Incorrect ID!"});
        }

        const category = await Category.findOne({"_id": req.params.id});
        if (!category) {
            return res.status(404).send({"message": "There is no category with such ID!"});
        }

        res.json(category);
    } catch(error) {
        errorHandler(res, error);
    }
}

// GET BY NAME
const getCategoryByName = async(req, res) => {
    try {
        const categorys = await Category.find({}).byName(req.params.name);
        // const categorys = await Category.findByName(req.params.name);

        if(categorys.length === 0) {
            return res.status(404).send({"message": "There is no category with such name!"});
        }

        res.json({ categorys });
    } catch(error) {
        errorHandler(res, error);
    }
}

// CREATE
const addCategory = async(req, res) => {
    try {
        // const { error } = categoryValidation(req.body);
        // if (error) {
        //     console.log(error);
        //     return res.status(400).send({"message": error.details[0].message})
        // }

        ///////////////////////////////////////////////////////
        const { category_name, parent_category_id } = req.body

        if (!category_name){
            return res.status(400).send({"message": "You should enter all required data!"});
        }

        const existedCategory = await Category.findOne({"category_name": { $regex: category_name, $options: "i"}});

        if (existedCategory) {
            return res.status(400).send({"message": "This category already exists!"})
        }

        const newCategory = await Category({
            category_name,
            parent_category_id,
        })

        await newCategory.save();
        return res.status(201).send({"message": "Category succesfully added!"})
    } catch(error) {
        errorHandler(res, error);
    }
}

// UPDATE BY ID
const updateCategoryById = async(req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send({"message": "Incorrect ID!"});
        }

        const { category_name, parent_category_id } = req.body


        if (!category_name){
            return res.status(400).send({"message": "You should enter all required data!"});
        }

        const existedCategory = await Category.findOne({"category_name": { $regex: category_name, $options: "i"}});

        if (existedCategory) {
            return res.status(400).send({"message": "This category already exists!"})
        }

        const updateResult = await Category.updateOne(
            {
                "_id": req.params.id
            },
            {
                $set:{
                    category_name,
                    parent_category_id,
                }
            }
        )

        if (updateResult.modifiedCount > 0){
            return res.status(400).send({"message": "Category data's successfully changed!"});
        } else if (updateResult.matchedCount === 0){
            return res.status(404).send({"message": "There is no category with such ID!"});
        }
    } catch(error) {
        errorHandler(res, error);
    }
}

// DELETE BY ID
const deleteCategoryById = async(req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send({"message": "Incorrect ID!"});
        }

        const deleteResult = await Category.deleteOne(
            {
                "_id": req.params.id
            }
        )

        if (deleteResult.deletedCount > 0) {
            return res.status(400).send({"message": "Category data's successfully deleted!"});
        } else if (deleteResult.deletedCount === 0) {
            return res.status(404).send({"message": "There is no category with such ID!"});
        }
    } catch(error) {
        errorHandler(res, error);
    }
}

module.exports = {
    getAllCategorys,
    getCategoryById,
    getCategoryByName,
    addCategory,
    updateCategoryById,
    deleteCategoryById
}