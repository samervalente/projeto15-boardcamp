import connection from "../database/postgre.js";
import customerSchema from "../schemas/customerSchema.js";

async function validateCustomer(req,res,next){
    const customer = req.body
   
    try {  
       
        const validateResult = customerSchema.validate(customer)
        if(validateResult.error){
            return res.sendStatus(400)
        }
      
        
        const {rows: customerDB} = await connection.query(
         `SELECT (cpf) FROM customers WHERE cpf = '${customer.cpf}'`)
        
        if(customerDB.length !== 0 && req.route.methods.post){
            return res.sendStatus(409)
        }    

        next()
        

    } catch (error) {
       
         res.sendStatus(500)
    }
}

export default validateCustomer