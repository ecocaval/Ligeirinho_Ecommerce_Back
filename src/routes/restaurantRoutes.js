//* Libraries
import { Router } from "express";

//* Controllers
import {
    createNewProduct, createNewRestaurant, deleteProductById,
    getAllProducts, getAllRestaurantProducts, getAllRestaurants,
    getProductbyId, getRestaurantById, linkProductToRestaurant
} from "../controllers/restaurantController.js";

//* Middlewares
import { validateToken } from "../middlewares/TokenMiddleWare.js";
import { validateSchema } from "../middlewares/SchemaMiddleware.js";

//* Schemas
import { createNewProductSchema, createNewRestaurantSchema } from "../schemas/restaurantSchemas.js";

const restaurantRouter = Router();

restaurantRouter.get('/restaurants', validateToken, getAllRestaurants); //* OK

restaurantRouter.get('/restaurants/:restaurantId', validateToken, getRestaurantById); //* OK

restaurantRouter.post('/restaurants', validateSchema(createNewRestaurantSchema), createNewRestaurant); //* OK

restaurantRouter.get('/products', validateToken, getAllProducts); //* OK

restaurantRouter.get('/restaurants/:restaurantId/products', validateToken, getAllRestaurantProducts); //* OK

restaurantRouter.get('/restaurants/:restaurantId/products/:productId', validateToken, getProductbyId); //* OK

restaurantRouter.post('/restaurants/:restaurantId/products', validateSchema(createNewProductSchema), createNewProduct, linkProductToRestaurant); //* OK

restaurantRouter.delete('/restaurants/:restaurantId/products/:productId', deleteProductById); //* OK

export default restaurantRouter;