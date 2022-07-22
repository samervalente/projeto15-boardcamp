import connection from "../database/postgre.js";
import rentSchema from "../schemas/rentSchema.js";

async function validateRent(req, res, next){
    const rent = req.body
    try {
        const resultValidate = rentSchema.validate(rent)
        const {rows: gameId} = await connection.query(`SELECT (id) FROM games WHERE id = ${rent.gameId}`)
        const {rows: stockTotal} = await connection.query(`SELECT ("stockTotal") FROM games WHERE id = ${rent.gameId}`)

        if(resultValidate.error || !gameId[0].id || stockTotal[0].stockTotal === 0){
            return res.sendStatus(400)
        }
        res.locals.stockTotal = stockTotal
        next()


    } catch (error) {
        
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
            return res.sendStatus(400)
        }

        next()
    } catch (error) {
        res.sendStatus(500)
    }
}


export {validateRent, validateFinishRent}