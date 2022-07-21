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

export default insertGame