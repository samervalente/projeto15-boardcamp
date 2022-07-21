import validateCategorie from "../middlewares/categoriesMiddleware.js"
import {insertCategorie, listCategories} from "../controllers/categoriesController.js"

import {Router} from "express"
const router = Router()

router.post("/categories", validateCategorie, insertCategorie)
router.get("/categories", listCategories)


export default router;