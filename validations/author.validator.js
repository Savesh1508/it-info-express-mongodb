const Joi = require('joi');

const authorSchema = Joi.object({
    author_first_name: Joi.string().pattern(new RegExp("^[a-zA-Z]+$")),
    author_last_name: Joi.string().pattern(new RegExp("^[a-zA-Z]+$")),
    author_nick_name: Joi.string().max(25).required(),
    author_email: Joi.string().email().required(),
    author_phone: Joi.string().pattern(/\d{2}-\d{3}-\d{2}-\d{2}/),
    author_password: Joi.string().min(6).max(25).required(),
    confirm_password: Joi.ref("author_password"),
    author_info: Joi.string(),
    author_position: Joi.string(),
    author_photo: Joi.string().default("/author/avatar.jpg"),
    author_is_expert: Joi.boolean().default(false),
    author_is_active: Joi.boolean().truthy("Yes").valid(true),
});

module.exports = authorSchema;