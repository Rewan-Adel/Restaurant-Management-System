const Joi = require('joi');

/**
* Validation schema for user registration
* @registerSchema - Schema for user registration
*/

const registerSchema = Joi.object({
    username: Joi.string()
    .min(5)
    .trim()
    .required()
    .messages({
        'string.base': 'Username should be a type of text',
        'string.empty': 'Username cannot be empty',
        'string.min': 'Username should have a minimum length of 5 characters',
        'any.required': 'Username is required'
    }),
    email: Joi.string()
    .min(6)
    .required()
    .email()
    .messages({
        'string.base': 'Email should be a type of text',
        'string.empty': 'Email cannot be empty',
        'string.min': 'Email should have a minimum length of 6 characters',
        'string.email': 'Invalid email format',
        'any.required': 'Email is required'
    }),
    password: Joi
    .string()
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/) 
    .min(6)
    .trim()
    .required()
    .messages({
        'string.base': 'Password should be a type of text',
        'string.empty': 'Password cannot be empty',
        'string.min': 'Password should have a minimum length of 6 characters',
        'any.required': 'Password is required',
        'string.pattern.base': 'Password must contain both letters and numbers only'
    })
});
/**
* Validation schema for user  login
* @loginSchema - Schema for user login
*/

const loginSchema = Joi.object({
    email: Joi.string()
    .min(6)
    .required()
    .email()
    .messages({
        'string.base': 'Email should be a type of text',
        'string.empty': 'Email cannot be empty',
        'string.min': 'Email should have a minimum length of 6 characters',
        'string.email': 'Email should have a valid email format',
        'any.required': 'Email is required'
    }),
    password: Joi
    .string()
    .min(6)
    .trim()
    .required()
    .messages({
        'string.base': 'Password should be a type of text',
        'string.empty': 'Password cannot be empty',
        'string.min': 'Password should have a minimum length of 6 characters',
        'any.required': 'Password is required'
    })
});

/**
* @param - data - The data to be validated username, email and password
* @exports - Exports the register validation functions
*/

exports.registerValidation = (data) => {
    const { error, value } = registerSchema.validate(data);
    return { error, value };
}
/**
* @param - data - The data to be validated email and password
* @exports - Exports the login validation functions
*/
exports.loginValidation = (data) => {
    const { error, value } = loginSchema.validate(data);
    return { error, value };
};

exports.emailValidation = (data) => {
    const emailSchema = Joi.object({
        email: Joi.string()
        .min(6)
        .required()
        .email()
        .messages({
            'string.base': 'Email should be a type of text',
            'string.empty': 'Email cannot be empty',
            'string.min': 'Email should have a minimum length of 6 characters',
            'string.email': 'Email should have a valid email format',
            'any.required': 'Email is required'
        }),
    });
    const { error, value } = emailSchema.validate(data);
    return { error, value };
};