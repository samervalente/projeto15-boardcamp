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
        
        if(CustomerAndGameData.length === 0 || CustomerAndGameData[0].stockTotal === 0){
            return res.sendStatus(400)
        }
        res.locals.stockTotal = CustomerAndGameData[0].stockTotal
      
        next()

    } catch (error) {
        console.log(error)
         res.sendStatus(500)
    }
}

async function validateFinishRent(req, res, next){
    const id = Number(req.params.id)
    try {
        const {rows: rent} = await connection.query(`SELECT * FROM rentals WHERE id = $1`,[id])
        console.log(rent)
        if(!rent[0].id){
            return res.sendStatus(404)
        }

        if(rent[0].returnDate !== null){
            return res.status(400).send("Rent already finished")
        }

        next()
    } catch (error) {
        res.sendStatus(500)
    }
}


export {validateRent, validateFinishRent}