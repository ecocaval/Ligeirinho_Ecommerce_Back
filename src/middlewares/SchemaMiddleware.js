//* Functions
import sanitizeInfo from "../validations/sanitizeInfo.js"

export function validateSchema(schema) {
    return (req, res, next) => {
        req.sanitizedBody = sanitizeInfo(req.body)

        const { error } = schema.validate(req.sanitizedBody, { abortEarly: false })

        if (error) {
            const errorMessages = error.details.map(err => err.message)
            return res.status(422).send(errorMessages)
        }        
        next()
    }
}