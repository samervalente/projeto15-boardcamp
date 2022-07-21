import connection from "../database/postgre.js";
import gameSchema from "../schemas/gameSchema.js";

async function validateGame(req, res, next) {
    const game = req.body
    try {
        const result = gameSchema.validate(game)
        const {rows:gameID} = await connection.query(`SELECT (id) FROM categories WHERE id = ${game.categoryId}`)
        console.log(gameID.length)
        if(gameID.length === 0 || result.error){
            return res.status(400).send("Id categorie doesn't exist or invalid payload")           
        }
          
        const {rows: name} = await connection.query(`SELECT (name) FROM games WHERE name = '${game.name}'`)
        
        if(name.length !== 0){
            return res.status(409).send("Game already exist")
        }
        
        next()

    } catch (error) {
         res.sendStatus(500)   
    }
}

export default validateGame