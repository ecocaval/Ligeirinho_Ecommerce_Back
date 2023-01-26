//* Libraries
import Joi from "@hapi/joi";

export const createNewRestaurantSchema = Joi.object({
    name: Joi.string().min(1).max(20).required(),
    description: Joi.string(),
    image: Joi.string().pattern(/^[a-zA-Z0-9-_]+[:./\\]+([a-zA-Z0-9 -_./:=&"'?%+@#$!])+$/).required,
    typeOfFood: Joi.string().min(1).max(20).required,
    price: Joi.number().min(1).max(10).required,
    product: Joi.array().min(3).required,
})

export const createNewProductSchema = Joi.object({
    restaurantId: Joi.string().min(3).max(30).required,
    name: Joi.string().min(3).max(20).required,
    description: Joi.string().min(3).required,
    price: Joi.number().min(3).required,
    image: Joi.string().pattern(/^[a-zA-Z0-9-_]+[:./\\]+([a-zA-Z0-9 -_./:=&"'?%+@#$!])+$/).required,
})