import categoriesSchema from "../schemas/categoriesSchema.js"
import connection from "../database/postgre.js"

async function validateCategorie(req, res, next){
    const categorie = req.body
    
   try {
    const result = categoriesSchema.validate(categorie)
    if(result.error){
        return res.sendStatus(400)
    }
    console.log("rodou")
    const {rows: categorieDB} = await connection.query(`SELECT * FROM categories WHERE name = '${categorie.name}'`)
   console.log(categorieDB)
    if(categorieDB.length !== 0){
        return res.sendStatus(409)
    }

    
    next()
    

   } catch (error) {
        return res.sendStatus(500)
   }

}

export default validateCategorie