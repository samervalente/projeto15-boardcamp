import {Router} from "express"
import validateGame from "../middlewares/gamesMiddleware.js"
import insertGame from "../controllers/gamesController.js"

const router = Router()
router.post("/games", validateGame, insertGame)

export default router
