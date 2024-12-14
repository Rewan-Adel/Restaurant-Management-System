const Joi = require('joi');

const itemAdditionSchema = Joi.object({
    name: Joi.string()
    .trim()
    .max(100)
    .required()
    .messages({
        'string.base': 'Name must be a string',
        'string.empty': 'Name cannot be empty',
        'string.max': 'Name must not be more than 100 characters',
        'any.required': 'Name is required'
    }),
    description: Joi.string()
    .max(500)
    .required()
    .messages({
        'string.base': 'Description must be a string',
        'string.empty': 'Description cannot be empty',
        'string.max': 'Description must not be more than 500 characters',
        'any.required': 'Description is required'
    }),
    price: Joi.number()
    .required()
    .messages({
        'number.base': 'Price must be a number',
        'number.empty': 'Price cannot be empty',
        'any.required': 'Price is required'
    }),
    category: Joi.string().required().messages({
        'string.base': 'Category must be a string',
        'string.empty': 'Category cannot be empty',
        'any.required': 'Category is required'
    })
});

const itemUpdatingSchema = Joi.object({
    name: Joi.string()
    .trim()
    .max(100)
    .messages({
        'string.base': 'Name must be a string',
        'string.empty': 'Name cannot be empty',
        'string.max': 'Name must not be more than 100 characters',
    }),
    description: Joi.string()
    .max(500)
    .messages({
        'string.base': 'Description must be a string',
        'string.empty': 'Description cannot be empty',
        'string.max': 'Description must not be more than 500 characters',
    }),
    price: Joi.number()
    .messages({
        'number.base': 'Price must be a number',
        'number.empty': 'Price cannot be empty',
    }),
    category: Joi.string().messages({
        'string.base': 'Category must be a string',
        'string.empty': 'Category cannot be empty',
    })
});

exports.addValidation = (data) => {
    const {value, error} = itemAdditionSchema.validate(data);
    return {
        value, 
        error
    };
};

exports.updateValidation = (data) => {
    const {value, error} = itemUpdatingSchema.validate(data);
    return {
        value, 
        error
    };
};