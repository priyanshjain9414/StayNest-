const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title : Joi.string().required(),
        description : Joi.string().required(),
        price : Joi.number().required().min(0),
        country : Joi.string().required(),
        location : Joi.string().required(),
        image : Joi.allow("",null) 
    }).required()
})

module.exports.reviewschema = Joi.object({
    review : Joi.object({
        comment:Joi.string().required(),
        rating:Joi.number().required()
    }).required()
})