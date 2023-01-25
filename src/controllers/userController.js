//* Libraries
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import dayjs from "dayjs";

//* Config
import db from "../config/database.js";

export async function getAllUsers(req, res) {
    try {
        const users = await db.collection('users').find().toArray()

        if (users.length === 0) return res.status(404).send("No users were found, create one.")

        return res.send(users.reverse())

    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
}

export async function getUserById(req, res) {

    const { userId } = { ...req.params }

    try {

        const user = await db.collection('users').findOne({
            _id: ObjectId(userId)
        })

        if (!user) return res.status(404).send("This user does not exist") 

        return res.send({
            ...user,
            creationDate: dayjs(user.creationDate).format('DD/MM/YYYY')
        })

    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
}

export async function createNewUser(req, res, next) {

    const userToCreate = { ...req.sanitizedBody }

    delete userToCreate.confirmPassword

    userToCreate.password = bcrypt.hashSync(userToCreate.password, 10)

    try {

        // looks for repeated email to avoid conflict
        const userEmailInUse = await db.collection('users').findOne({
            email: userToCreate.email
        })
        if(userEmailInUse) return res.sendStatus(409)

        const response = await db.collection('users').insertOne({
            ...userToCreate,
            creationDate: new Date(Date.now())
        })

        req.insertedIdForToken = response.insertedId

        if (!(response.acknowledged === true)) return res.sendStatus(500)

        next()

    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
}

export async function changeUserInfo(req, res) {

    const { userId } = { ...req.params }
    const userToUpdate = { ...req.sanitizedBody }

    try {
        const response = await db.collection('users').updateOne({ _id: ObjectId(userId) }, {
            $set: {
                ...userToUpdate
            }
        })

        if (response.modifiedCount < 1) return res.sendStatus(204)

        return res.sendStatus(200)

    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
}


export async function deleteUserById(req, res, next) {

    const { userId } = { ...req.params }

    try {
        const response = await db.collection('users').deleteOne({ _id: ObjectId(userId) })

        if (response.deletedCount < 1) return res.sendStatus(404)

        next()

    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
}
