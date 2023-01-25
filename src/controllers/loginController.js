//* Libraries
import bcrypt from 'bcrypt'

//* Config
import db from "../config/database.js"

export async function userLogin(req, res) {

    const userRequest = { ...req.sanitizedBody }

    try {
        // checks if email exists
        const userInDb = await db.collection('users').findOne({
            email: userRequest.email
        })
        if (!userInDb) return res.status(404).send("There are no accounts with this data")

        // checks if password sent is right
        const passwordMatches = bcrypt.compareSync(userRequest.password, userInDb.password)
        if (!passwordMatches) return res.status(404).send("There are no accounts with this data")

        const { userId, token } = await db.collection('tokens').findOne({
            userId: userInDb._id
        })

        // sendsBack userId and userToken
        return res.send({ userId, token: "Bearer " + token })
    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
}