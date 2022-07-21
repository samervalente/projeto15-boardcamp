import {Router} from "express"
import validateGame from "../middlewares/gamesMiddleware.js"
import {insertGame, listGames} from "../controllers/gamesController.js"

const router = Router()
router.post("/games", validateGame, insertGame)
router.get("/games", listGames)

export default router
