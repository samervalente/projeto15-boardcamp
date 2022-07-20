import connection from "../database/postgre.js"

async function insertCategorie(req, res){
    const categorie = req.body
    try {
        await connection.query(`INSERT INTO categories (name) VALUES ('${categorie.name}')`)
        res.sendStatus(200)
    } catch (error) {
        return res.sendStatus(500)
    }
}

export default insertCategorie