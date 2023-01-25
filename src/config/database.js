//* Libraries
import { MongoClient } from "mongodb"
import dotenv from "dotenv"

dotenv.config()

let db
let mongoClient = new MongoClient(process.env.DATABASE_URL)

try {
    await mongoClient.connect()
    db = mongoClient.db()
} catch (err) {
    console.error(err)
}

export default db