//* Libraries
import { ObjectId } from "mongodb"

//* Configuration
import db from "../config/dabaBaseConnection.js"

export async function validateToken(req, res, next) {

    const { authorization } = req.headers

    if (!authorization) return res.sendStatus(401) //if no authorization is present returns unauthorized

    const userId = ObjectId(req.params.id)
    const token = authorization.replace("Bearer ", "")

    try {
        const tokenInDb = await db.collection("tokens").findOne({ userId })

        if (tokenInDb?.token !== token) return res.sendStatus(401)
        
    } catch (err) {
        console.error(err)
        return res.sendStatus(500)
    }
    next()
}