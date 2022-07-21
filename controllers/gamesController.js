import connection from "../database/postgre.js"

async function insertGame(req, res){
const game = req.body
  
    try {
        await connection.query(`INSERT INTO games (name, image, "pricePerDay", "stockTotal", "categoryId") VALUES ('${game.name}','${game.image}',${game.pricePerDay},${game.stockTotal},${game.categoryId})`)
        console.log("passou")
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
            console.log(capitalize)
            const {rows: games} = await connection.query(
            `SELECT * FROM games WHERE name LIKE '${name}%' OR name LIKE '${capitalize}%'`)
            res.send(games).status(200)
        }else{
            const {rows: games} = await connection.query(`SELECT * FROM games`)
                res.send(games).status(200)
        }

    } catch (error) {
        res.sendStatus(500)   
    }
      

}

export  {insertGame, listGames}