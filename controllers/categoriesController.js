import connection from "../database/postgre.js"

async function insertCategorie(req, res){
    const categorie = req.body
    try {
        await connection.query(`INSERT INTO categories (name) VALUES ('${categorie.name}')`)
        res.sendStatus(201)
    } catch (error) {
        return res.sendStatus(500)
    }
}

async function listCategories(req, res) {
    try {
        const {rows: categories} = await connection.query(`SELECT * FROM categories`)
        res.send(categories).status(200)
    } catch (error) {
         res.sendStatus(500)
    }
}

export  {insertCategorie, listCategories}