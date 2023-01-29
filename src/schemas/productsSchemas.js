//* Libraries
import Joi from '@hapi/joi'

export const insertProductsSchema = Joi.object({
    productId: Joi.string().required(),
    quantity: Joi.number().required(),
    description: Joi.string().allow("").max(100).required(),
    price: Joi.number().min(3).required(),
    restaurantId: Joi.string().required(),
    bigImages: Joi.array().required()
})





