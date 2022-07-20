import validateCategorie from "../middlewares/categoriesMiddlewares.js"
import insertCategorie from "../controllers/categoriesController.js"
import {Router} from "express"
const router = Router()

router.post("/categories", validateCategorie, insertCategorie)
router.get("/categories")

export default router;