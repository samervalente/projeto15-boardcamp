import connection from "../database/postgre.js"

async function insertGame(req, res){
const game = req.body
  
    try {
        await connection.query(`INSERT INTO games (name, image, "pricePerDay", "stockTotal", "categoryId") VALUES ('${game.name}','${game.image}',${game.pricePerDay*100},${game.stockTotal},${game.categoryId})`)
        
        res.sendStatus(201)
    } catch (error) {
        res.sendStatus(500)
    }
}

async function listGames(req, res) {
    
    try {
        if(req.query.name){
            const name = req.query.name
            const capitalize = name.charAt(0).toUpperCase() + name.slice(1)
           
            const {rows: games} = await connection.query(
            `SELECT games.*, categories.name as "categoryName" FROM games 
            JOIN categories
            ON games."categoryId" = categories.id  
            WHERE games.name LIKE '${name}%' OR games.name LIKE '${capitalize}%'`)
            res.send(games).status(200)
        }else{
            const {rows: games} = await connection.query(`SELECT games.*, categories.name as "categoryName" FROM games
            JOIN categories
            ON games."categoryId" = categories.id`)
                res.status(200).send(games)
        }

    } catch (error) {
        
        res.sendStatus(500)   
    }
      

}

export  {insertGame, listGames}