//* Libraries
import Joi from '@hapi/joi'

export const createNewUserSchema = Joi.object({
    name: Joi.string().min(1).max(20).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(1).max(30).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
})

export const changeUserInfoSchema = Joi.object({
    name: Joi.string().min(1).max(20),
    email: Joi.string().email(),
    password: Joi.string().min(1).max(30),
    confirmPassword: Joi.string().when('password', {
        is: Joi.exist(),
        then: Joi.valid(Joi.ref('password')).required()
    }),
})

export const userLoginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
})