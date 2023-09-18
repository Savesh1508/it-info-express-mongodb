// const Joi = require('joi');

// const adminSchema = Joi.object({
//     admin_name: Joi.string().max(30).pattern(new RegExp("^[a-zA-Z]+$")).required(),
//     admin_email: Joi.string().email().required(),
//     admin_password: Joi.string().min(8).required(),
//     admin_confirm_password: Joi.ref("admin_password").required(),
//     admin_is_active: Joi.boolean().default(false),
//     admin_is_creator: Joi.boolean().default(false),
//     admin_is_creator: Joi.boolean().default(false),
// });

// module.exports = adminSchema;