const Joi = require('joi');

const getFullName = (parent) => {
    return parent.author_first_name + " " + parent.author_last_name
}

exports.authorValidation = (data) => {
    const schema = Joi.object({
        author_first_name: Joi.string().pattern(new RegExp("^[a-zA-Z]+$")).required(),
        author_last_name: Joi.string().pattern(new RegExp("^[a-zA-Z]+$")).required(),
        author_full_name: Joi.string().default(getFullName),
        author_nick_name: Joi.string().max(25),
        author_email: Joi.string().email().message("Invalid email").required(),
        author_phone: Joi.string().pattern(/\d{2}-\d{3}-\d{2}-\d{2}/),
        author_password: Joi.string().min(6).max(25).required(),
        confirm_password: Joi.ref("author_password"),
        author_info: Joi.string(),
        author_position: Joi.string(),
        author_photo: Joi.string().default("/author/avatar.jpg"),
        author_is_expert: Joi.boolean().default(false),
        author_is_active: Joi.boolean().truthy("Yes").valid(true),
        // gender: Joi.string().valid("male", "female"),
        // birth_date: Joi.date().greater(new Date("2005-01-01")),
        // birth_year: Joi.number().integer().min(1970).max(2005),
        // referred: Joi.boolean().required(),
        // referralDetails: Joi.string().when("referred", {
        //     is: true,
        //     then: Joi.string().min(3).required(),
        //     otherwise: Joi.string().optional(),
        // }),
        // coding_lang: Joi.array().items(Joi.string()),
    });

    return schema.validate(data);
}