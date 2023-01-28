//* Libraries
import Joi from '@hapi/joi'

export const insertProductsSchema = Joi.object({
    productId: Joi.string().required(),
    quantity: Joi.number().required(),
    description: Joi.string().allow("").max(100).required()
})





