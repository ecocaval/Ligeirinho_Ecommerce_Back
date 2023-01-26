//* Libraries
import express from "express"
import cors from "cors"

//* Routers
import userRouter from "./routes/userRoutes.js"
import tokenRouter from "./routes/tokenRoutes.js"
import loginRouter from "./routes/loginRoutes.js"
import restaurantRouter from "./routes/restaurantRoutes.js"
import cartRouter from "./routes/cartsRoutes.js"

const PORT = 5000

const app = express()

app.use(cors())
app.use(express.json())

app.use(userRouter)
app.use(tokenRouter)
app.use(loginRouter)
app.use(restaurantRouter)
app.use(cartRouter)

app.listen(PORT, () => console.log(`Server Initialized. Port: ${PORT} `))