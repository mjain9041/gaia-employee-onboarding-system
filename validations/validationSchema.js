const Joi = require('joi');

module.exports = {
    registerSchema: Joi.object({
        firstName: Joi.string().min(2).max(30).required(),
        lastName: Joi.string().min(2).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    }),

    loginSchema: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    })
}