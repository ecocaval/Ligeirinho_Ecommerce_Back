//* Config 
import db from "../config/database.js";

//* Libraries
import dayjs from "dayjs";
import { ObjectId } from "mongodb";

export async function getAllRestaurants(req, res) {
    try {

        const restaurants = await db.collection('restaurants').find().toArray();

        if (restaurants.length === 0) return res.status(404).send("No restaurants were found, create one.");

        return res.send(restaurants.reverse());

    } catch (err) {

        console.log(err);
        return res.sendStatus(500);

    };
}

export async function getRestaurantById(req, res) {

    const { restaurantId } = { ...req.params };

    try {

        const restaurant = await db.collection('restaurants').findOne({
            _id: ObjectId(restaurantId)
        });

        if (!restaurant) return res.status(404).send("This restaurant does not exist");

        return res.send({
            ...restaurant,
            creationDate: dayjs(restaurant.creationDate).format('DD/MM/YYYY')

        });

    } catch (err) {

        console.log(err);
        return res.sendStatus(500);

    };
}

export async function createNewRestaurant(req, res) {

    const restaurantToCreate = { ...req.sanitizedBody };

    try {

        const restaurant = await db.collection('restaurants').findOne({
            name: restaurantToCreate.name
        });

        if (restaurant) return res.sendStatus(409);

        const response = await db.collection('restaurants').insertOne({
            ...restaurantToCreate,
            creationDate: new Date(Date.now())
        });

        if (!(response.acknowledged === true)) return res.sendStatus(500)

        return res.sendStatus(201)

    } catch (err) {

        console.log(err);
        return res.sendStatus(500);

    };
}

export async function getAllProducts(req, res) {

    try {

        const products = await db.collection('products').find().toArray();

        if (products.length === 0) return res.status(404).send("No products were found, create one.");

        return res.send(products.reverse())

    } catch (err) {

        console.log(err);
        return res.sendStatus(500);

    }
}

export async function getAllRestaurantProducts(req, res) {

    const { restaurantId } = { ...req.params }

    try {

        const products = await db.collection('products').find({ restaurantId: ObjectId(restaurantId) }).toArray();

        if (products.length === 0) return res.status(404).send("No products were found, create one.");

        return res.send(products.reverse())

    } catch (err) {

        console.log(err);
        return res.sendStatus(500);

    }
}

export async function getProductbyId(req, res) {

    const { productId, restaurantId } = { ...req.params };

    try {

        const product = await db.collection('products').findOne({
            _id: ObjectId(productId),
            restaurantId: ObjectId(restaurantId)
        });

        if (!product) return res.status(404).send("This products does not exist");

        return res.send({
            ...product,
            creationDate: dayjs(product.creationDate).format('DD/MM/YYYY')
        });

    } catch (err) {

        console.log(err);
        return res.sendStatus(500);

    };
}

export async function createNewProduct(req, res, next) {

    const productToCreate = { ...req.sanitizedBody };
    const { restaurantId } = { ...req.params }

    try {

        const product = await db.collection('products').findOne({
            restaurantId: ObjectId(restaurantId),
            name: productToCreate.name
        });

        if (product) return res.sendStatus(409);

        const response = await db.collection('products').insertOne({
            ...productToCreate,
            restaurantId: ObjectId(restaurantId),
            creationDate: new Date(Date.now())
        });

        req.insertedProductId = response.insertedId

        if (!(response.acknowledged === true)) return res.sendStatus(500)

        next()

    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    };
}

export async function linkProductToRestaurant(req, res) {

    const { restaurantId } = { ...req.params }

    try {

        const restaurant = await db.collection('restaurants').findOne({ _id: ObjectId(restaurantId) });

        if (!restaurant) return res.sendStatus(401)

        if (!restaurant.products) restaurant.products = []

        await db.collection('restaurants').updateOne({ _id: ObjectId(restaurantId) }, {
            $set: {
                products: [...restaurant.products, req.insertedProductId]
            }
        })

        return res.sendStatus(201)

    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    };
}

export async function deleteProductById(req, res) {

    const { productId, restaurantId } = { ...req.params }

    try {
        const response = await db.collection('products').deleteOne({
            _id: ObjectId(productId),
            restaurantId: ObjectId(restaurantId)
        })

        if (response.deletedCount < 1) return res.sendStatus(404)

        return res.sendStatus(200)

    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
}