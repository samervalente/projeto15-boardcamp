import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import categoriesRouter from "./routes/categoriesRouter.js"
import gamesRouter from "./routes/gamesRouter.js"
import customersRouter from "./routes/customersRouter.js"

const app = express()
app.use([cors(), express.json()])
dotenv.config()


app.use(categoriesRouter)
app.use(gamesRouter)
app.use(customersRouter)

app.listen(4000)
