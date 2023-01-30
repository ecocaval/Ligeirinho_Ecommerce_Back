//* Libraries
import { ObjectId } from "mongodb"
import { v4 as uuidv4 } from "uuid"

//* Config
import db from "../config/database.js"

export async function getAllTokens(req, res) {

    try {
        const tokens = await db.collection('tokens').find().toArray()

        if (tokens.length === 0) return res.status(404).send("No tokens were found, create one.")

        return res.send(tokens.reverse())

    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
}

export async function createUserToken(req, res, next) {

    const userId = req.insertedIdForToken

    const token = uuidv4()

    try {
        const response = await db.collection('tokens').insertOne({
            userId: ObjectId(userId) ,
            token,
            creationDate: new Date(Date.now())
        })

        if (!(response.acknowledged === true)) return res.sendStatus(500)

        next()

    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
}

export async function deleteTokenByUserId(req, res) {

    const { userId } = { ...req.params }

    try {
        const response = await db.collection('tokens').deleteOne({ userId: ObjectId(userId) })

        if (response.deletedCount < 1) return res.sendStatus(500)

        return res.sendStatus(200)

    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
}