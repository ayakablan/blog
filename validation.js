const Joi = require('@hapi/joi');
 
//register validation
const registerValidation = data => {
    const Schema = Joi.object({
        name: Joi.string()
        .min(6)
        .required(),
        email: Joi.string()
        .min(6)
        .required()
        .email(),
        password: Joi.string()
        .min(8)
        .required()  
    });
    return Schema.validate(data);
};

//login validation
const loginValidation = data => {
    const Schema = Joi.object({
        email: Joi.string()
        .required()
        .email(),
        password: Joi.string()
        .required()  
    });
    return Schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
