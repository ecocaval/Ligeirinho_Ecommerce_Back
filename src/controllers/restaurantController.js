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

export async function changeRestaurantById(req, res) {

    const { restaurantId } = { ...req.params }
    const restaurantUpdate = { ...req.body }

    try {

        const restaurant = await db.collection('restaurants').findOne({
            _id: ObjectId(restaurantId)
        });

        if (!restaurant) return res.status(404).send("This restaurant does not exist");

        await db.collection('restaurants').updateOne({_id: ObjectId(restaurantId)}, {
            $set: {
                ...restaurantUpdate
            }
        })

        return res.sendStatus(200);

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

export async function getUserLikedRestaurants(req, res) {

    const { userId } = req.params

    try {
        const likedRestaurantes = await db.collection('likedRestaurants').find({
            userId: ObjectId(userId)
        }).toArray()

        if (likedRestaurantes.length === 0) return res.sendStatus(404);

        return res.send(likedRestaurantes)
    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
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

export async function createLikedRestaurants(req, res) {

    const userId = req.insertedIdForToken

    try {

        const insert = await db.collection("likedRestaurants").insertOne({
            userId: ObjectId(userId),
            restaurantsLiked: []
        })

        return res.sendStatus(201)

    } catch (err) {
        console.log(err)
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

export async function likeRestaurant(req, res) {

    const { restaurantId } = { ...req.body }
    const { userId } = { ...req.params }

    try {

        const response = await db.collection('likedRestaurants').findOne({ userId: ObjectId(userId) })

        if ([...response.restaurantsLiked].includes(restaurantId)) return res.sendStatus(409)

        await db.collection('likedRestaurants').updateOne({ userId: ObjectId(userId) }, {
            $set: {
                restaurantsLiked: [...response.restaurantsLiked, restaurantId]
            }
        })

        return res.sendStatus(200)

    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
}

export async function dislikeRestaurant(req, res) {

    const { restaurantId } = { ...req.body }
    const { userId } = { ...req.params }

    try {

        const response = await db.collection('likedRestaurants').findOne({ userId: ObjectId(userId) })

        let updatedRestaurants = [...response.restaurantsLiked]

        let indexToDelete = null

        for (let i = 0; i < updatedRestaurants.length; i++) {
            if (updatedRestaurants[i] === restaurantId) {
                indexToDelete = i;
                break;
            }
        }

        updatedRestaurants.splice(indexToDelete, 1)

        await db.collection('likedRestaurants').updateOne({ userId: ObjectId(userId) }, {
            $set: {
                restaurantsLiked: updatedRestaurants
            }
        })

        return res.sendStatus(200)

    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
}

export async function createNewProduct(req, res, next) {

    const productToCreate = { ...req.sanitizedBody };
    const { restaurantId } = { ...req.params }

    try {

        const restaurant = await db.collection('restaurants').findOne({
            _id: ObjectId(restaurantId)
        });

        if (!restaurant) return res.status(404).send("This restaurant does not exist");

        const product = await db.collection('products').findOne({
            restaurantId: ObjectId(restaurantId),
            name: productToCreate.name
        });

        if (product) return res.sendStatus(409);

        if (restaurant.categories.includes(productToCreate.category)) {

            const response = await db.collection('products').insertOne({
                ...productToCreate,
                restaurantId: ObjectId(restaurantId),
                creationDate: new Date(Date.now())
            });

            req.insertedProductId = response.insertedId

            if (!(response.acknowledged === true)) return res.sendStatus(500)

            return next()
        }

        return res.status(400).send(`Category must match restaurant categories ${restaurant.categories.map((category) => `${category} `)}`)

    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    };
}

export async function changeProductById(req, res) {

    const { productId, restaurantId } = { ...req.params };

    const productUpdate = { ...req.body }

    try {

        const product = await db.collection('products').findOne({
            _id: ObjectId(productId),
            restaurantId: ObjectId(restaurantId)
        });
        if (!product) return res.status(404).send("This products does not exist");

        const restaurant = await db.collection('restaurants').findOne({
            _id: ObjectId(restaurantId)
        });

        if (!restaurant) return res.status(404).send("This restaurant does not exist");

        if (productUpdate.category) {
            if (!restaurant.categories.includes(productUpdate.category)) {
                return res.status(400).send(`Category must match restaurant categories ${restaurant.categories.map((category) => `${category} `)}`)
            }
        }

        await db.collection('products').updateOne({ _id: ObjectId(productId) }, {
            $set: {
                ...productUpdate
            }
        })

        return res.sendStatus(200)

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