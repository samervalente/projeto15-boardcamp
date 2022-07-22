import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import categoriesRouter from "./routes/categoriesRouter.js"
import gamesRouter from "./routes/gamesRouter.js"
import customersRouter from "./routes/customersRouter.js"
import rentalsRouter from "./routes/rentalsRouter.js"

const app = express()
app.use([cors(), express.json()])
dotenv.config()


app.use(categoriesRouter)
app.use(gamesRouter)
app.use(customersRouter)
app.use(rentalsRouter)

app.listen(4000)
