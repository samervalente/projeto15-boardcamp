import connection from "../database/postgre.js"

async function insertGame(req, res){
const game = req.body
  
    try {
        await connection.query(`INSERT INTO games (name, image, "pricePerDay", "stockTotal", "categoryId") VALUES ('${game.name}','${game.image}',${game.stockTotal},${game.categoryId},${game.pricePerDay})`)
        console.log("passou")
        res.sendStatus(201)
    } catch (error) {
        res.sendStatus(500)
    }
}

export default insertGame