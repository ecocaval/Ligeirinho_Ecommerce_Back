import { ObjectId } from "mongodb";

import db from "../config/database.js"

import checkIfCartExists from "./utils/checkIfCartExists.js";

export async function getAllCarts(req, res) {

    try {
        const carts = await db.collection('carts').find().toArray();

        if (carts.length === 0) return res.status(404).send('No carts were found, create one') //! Temporary

        return res.send(carts.reverse())

    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
}

export async function getUserCart(req, res) {

    const { userId } = { ...req.params }

    try {
        const cart = await checkIfCartExists(userId)

        if (!cart) return res.status(404).send("No cart was found linked to this user.")

        return res.send(cart)

    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
}

export async function createNewCart(req, res) {

    const { userId } = { ...req.params }

    try {

        if (await checkIfCartExists(userId)) return res.sendStatus(409)

        const cart = await db.collection('carts').insertOne({
            userId: ObjectId(userId),
            creationDate: new Date(Date.now()),
            products: []
        })

        if (!(cart.acknowledged === true)) return res.sendStatus(500)

        return res.sendStatus(201)

    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
}

export async function deleteCart(req, res) {

    const { userId } = { ...req.params }

    try {

        if (!(await checkIfCartExists(userId))) return res.sendStatus(404)

        const response = await db.collection('carts').deleteOne({
            userId: ObjectId(userId)
        })

        if (response.deletedCount < 1) return res.sendStatus(500)

        return res.sendStatus(200)

    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
}

export async function insertProduct(req, res) {

    const { userId } = { ...req.params }

    const productToInsert = { ...req.sanitizedBody }

    try {
        const userCart = await checkIfCartExists(userId)

        if (!userCart) return res.sendStatus(404)

        const response = await db.collection('carts').updateOne({ userId: ObjectId(userId)}, {
            $set: {
                products: [...userCart.products, productToInsert]
            }
        })

        if (response.modifiedCount < 1) return res.sendStatus(204)

        return res.sendStatus(200)

    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
}