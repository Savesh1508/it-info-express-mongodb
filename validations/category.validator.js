const Joi = require('joi');

const categorySchema = Joi.object({
    category_name: Joi.string()
        .min(2)
        .message("Сategory name must be more than 2 characters!")
        .max(255)
        .message("Сategory name must be less than 255 characters!")
        .required(),

    parent_category_id: Joi.string().alphanum(),
});

module.exports = categorySchema;