//* Libraries
import { ObjectId } from "mongodb"

//* Config
import db from "../../config/database.js"

export default async function checkIfCartExists(userId) {
    return await db.collection('carts').findOne({
        userId: ObjectId(userId)
    })
}