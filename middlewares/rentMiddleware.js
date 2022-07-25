import connection from "../database/postgre.js";
import rentSchema from "../schemas/rentSchema.js";

async function validateRent(req, res, next){
    const rent = req.body
   
    try {
        const resultValidate = rentSchema.validate(rent, {abortEarly: false})
        if(resultValidate.error){
            const erros = resultValidate.error.details.map(value => value.message)
            return res.status(400).send(erros)
        }

        const {rows: CustomerAndGameData} = await connection.query(`SELECT customers.id as idCustomer, games."stockTotal", games.id as idGame FROM customers
        JOIN games
        ON customers.id = $1 AND games.id = $2`,[rent.customerId, rent.gameId])
        
        if(CustomerAndGameData.length === 0){
            return res.status(404).send("Customer id or game id don't found")
        }

        if(CustomerAndGameData[0].stockTotal === 0){
            return res.status(400).send("Sorry, we don't have stock for this game. We'll let you know by email when it's available.")
        }
        res.locals.stockTotal = CustomerAndGameData[0].stockTotal
      
        next()

    } catch (error) {
       
         res.sendStatus(500)
    }
}

async function validateFinishRent(req, res, next){
    const id = Number(req.params.id)
    try {
        const {rows: rent} = await connection.query(`SELECT * FROM rentals WHERE id = $1`,[id])
       
        if(rent.length === 0 ){
            return res.status(404).send("Rent doesn't exist")
        }

        if(rent[0].returnDate !== null && req.route.methods.post){
            return res.status(400).send("Rent already finished")
        }

        if(rent[0].returnDate === null && req.route.methods.delete){
            return res.status(400).send("The lease hasn't been finalized")
        }
        next()
        
    } catch (error) {
        
        res.sendStatus(500)
    }
}


export {validateRent, validateFinishRent}