import Joi from 'joi';

const uuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

export const transaction = Joi.object({
    customerId: Joi.string().pattern(new RegExp(uuidRegex)).required().messages({
        'any.required': 'Please enter your customerId',
        'string.pattern.base': 'Please enter a valid customerId'
    }),
    amount: Joi.number().required().messages({
        'any.required': 'Please enter amount',
    }),
    paymentMode: Joi.string().required().valid('cash', 'transfer', 'card', 'cheque', 'other').messages({
        'any.required': 'Please enter mode of payment'
    })
});
