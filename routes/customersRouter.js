import {Router} from "express"
import validateCustomer from "../middlewares/customersMiddleware.js"
import {insertCustomer, listCustomers, listCustomersById, updateCustomer} from "../controllers/customersController.js"

const router = Router()
router.post("/customers", validateCustomer, insertCustomer)
router.get("/customers", listCustomers)
router.get("/customers/:id", listCustomersById)
router.put("/customers/:id",validateCustomer, updateCustomer)

export default router