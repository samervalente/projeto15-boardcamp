import connection from "../database/postgre.js"
import categorieSchema from "../schemas/categorieSchema.js"


async function validateCategorie(req, res, next){
    const categorie = req.body
    
   try {
    const result = categorieSchema.validate(categorie)
    if(result.error){
        return res.sendStatus(400)
    }
    
    const {rows: categorieDB} = await connection.query(`SELECT * FROM categories WHERE name = '${categorie.name}'`)
  
    if(categorieDB.length !== 0){
        return res.sendStatus(409)
    }

    
    next()
    

   } catch (error) {
         res.sendStatus(500)
   }

}

export default validateCategorie