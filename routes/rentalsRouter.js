import { Router } from "express";
import {validateRent, validateFinishRent}  from "../middlewares/rentMiddleware.js";
import {insertRent, listRentals, finishRent, deleteRent} from "../controllers/rentalsController.js"


const router = Router()
router.post("/rentals", validateRent, insertRent)
router.get("/rentals", listRentals)
router.post("/rentals/:id/return", validateFinishRent, finishRent)
router.delete("/rentals/:id", validateFinishRent, deleteRent)

export default router