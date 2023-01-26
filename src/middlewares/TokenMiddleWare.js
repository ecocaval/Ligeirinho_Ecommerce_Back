//* Libraries
import { ObjectId } from "mongodb"

//* Configuration
import db from "../config/database.js"

export async function validateToken(req, res, next) {

    const { authorization } = req.headers

    if (!authorization) return res.sendStatus(401)

    const { userId } = { ...req.params }
    const token = authorization.replace("Bearer ", "")

    try {
        if (userId) {

            const tokenInDb = await db.collection("tokens").findOne({
                userId: ObjectId(userId)
            })

            if (tokenInDb?.token !== token) return res.sendStatus(401)

        } else {
            
            const insertResponse = await db.collection("tokens").insertOne({
                token: token
            })

            if(insertResponse.acknowledged !== true) return res.sendStatus(500)
        }
    } catch (err) {
        console.error(err)
        return res.sendStatus(500)
    }
    next()
}