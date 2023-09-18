const Joi = require('joi');

exports.categoryValidation = (data) => {
    const schema = Joi.object({
        category_name: Joi.string()
            .min(2)
            .message("Сategory name must be more than 2 characters!")
            .max(255)
            .message("Сategory name must be less than 255 characters!")
            .required(),

        parent_category_id: Joi.string().alphanum(),
    });

    return schema.validate(data);
}