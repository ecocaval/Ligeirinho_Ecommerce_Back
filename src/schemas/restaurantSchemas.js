//* Libraries
import Joi from "@hapi/joi";

export const createNewRestaurantSchema = Joi.object({
    name: Joi.string().min(1).max(15).required(),
    description: Joi.string(),
    bigImages: Joi.array().items(Joi.string().pattern(/^[a-zA-Z0-9-_]+[:./\\]+([a-zA-Z0-9 -_./:=&"'?%+@#$!])+$/)).required(),
    smallImages: Joi.array().items(Joi.string().pattern(/^[a-zA-Z0-9-_]+[:./\\]+([a-zA-Z0-9 -_./:=&"'?%+@#$!])+$/)).required(),
    typeOfFood: Joi.string().min(1).max(10).valid("Japonesa", "Brasileira", "Pízza", "Doces", "Lanches", "Açai").required(),
    priceRank: Joi.number().min(1).max(5).required(),
})

export const createNewProductSchema = Joi.object({
    name: Joi.string().min(3).max(15).required(),
    description: Joi.string().min(1).required(),
    price: Joi.number().invalid(0).required(),
    bigImages: Joi.array().items(Joi.string().pattern(/^[a-zA-Z0-9-_]+[:./\\]+([a-zA-Z0-9 -_./:=&"'?%+@#$!])+$/)).required(),
    smallImages: Joi.array().items(Joi.string().pattern(/^[a-zA-Z0-9-_]+[:./\\]+([a-zA-Z0-9 -_./:=&"'?%+@#$!])+$/)).required(),
}) 

export const likeRestaurantSchema = Joi.object({
    name: Joi.string().min(3).max(15).required(),
    description: Joi.string().min(1).required(),
    price: Joi.number().invalid(0).required(),
    bigImages: Joi.array().items(Joi.string().pattern(/^[a-zA-Z0-9-_]+[:./\\]+([a-zA-Z0-9 -_./:=&"'?%+@#$!])+$/)).required(),
    smallImages: Joi.array().items(Joi.string().pattern(/^[a-zA-Z0-9-_]+[:./\\]+([a-zA-Z0-9 -_./:=&"'?%+@#$!])+$/)).required(),
}) 