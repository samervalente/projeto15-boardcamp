import connection from "../database/postgre.js";
import dayjs from "dayjs"
import 'dayjs/locale/de.js' 
import Joi from "joi";


const date = dayjs().format('YYYY-MM-DD')


async function insertRent(req, res) {
  const rent = req.body;
  const stockTotal = res.locals.stockTotal;
 
  const { customerId, gameId, daysRented } = rent;
  try {
    const { rows: gamePrice } = await connection.query(`
            SELECT ("pricePerDay") FROM games WHERE id = ${gameId}`);

    const price = gamePrice[0].pricePerDay;
    await connection.query(
      `INSERT INTO rentals (
                "customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES
                (${customerId},${gameId},'${date}',${daysRented},null,${
        price * daysRented
      },null)
            `
    );
    const currentStock = stockTotal - 1;
    console.log(typeof stockTotal);
    await connection.query(`UPDATE games SET "stockTotal"=${currentStock} WHERE id = ${gameId}`);

    res.send(rent).status(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

async function listRentals(req, res){

    try {
        if(req.query.customerId){
          const {rows: rentalsCustomer} = await connection.query(`SELECT rentals.*, customers.id as "idCustomer", customers.name, games.id as "idGame", games.name as "gameName", games."categoryId", categories.name as "categoryName" FROM rentals JOIN customers ON customers.id = rentals."customerId" JOIN games ON games.id = rentals."gameId" JOIN categories ON categories.id = games."categoryId"
          WHERE rentals."customerId" = $1`,[req.query.customerId])

          let JoinRentals = rentalsCustomer.map(obj => ({
            ...obj,
            customer: {id: obj.idCustomer, name: obj.name},
            game: {id: obj.idGame, name: obj.gameName, categoryId: obj.categoryId, categoryName: obj.categoryName},
          }))
          
          for(const rent of JoinRentals){
            delete rent.idCustomer;
            delete rent.name;
            delete rent.idGame
            delete rent.gameName
            delete rent.categoryId;
            delete rent.categoryName
          }

          return res.send(JoinRentals)
        }

        if(req.query.gameId){
          const {rows: gamesId} = await connection.query(`SELECT rentals.*, customers.id as "idCustomer", customers.name, games.id as "idGame", games.name as "gameName", games."categoryId", categories.name as "categoryName" FROM rentals JOIN customers ON customers.id = rentals."customerId" JOIN games ON games.id = rentals."gameId" JOIN categories ON categories.id = games."categoryId"
          WHERE rentals."gameId" = $1`,[req.query.gameId])


          let JoinRentals = gamesId.map(obj => ({
            ...obj,
            customer: {id: obj.idCustomer, name: obj.name},
            game: {id: obj.idGame, name: obj.gameName, categoryId: obj.categoryId, categoryName: obj.categoryName},
          }))
          
          for(const rent of JoinRentals){
            delete rent.idCustomer;
            delete rent.name;
            delete rent.idGame
            delete rent.gameName
            delete rent.categoryId;
            delete rent.categoryName
          }
    
          return res.send(JoinRentals)

        }

        const {rows: rentals} = await connection.query('SELECT rentals.*, customers.id as "idCustomer", customers.name, games.id as "idGame", games.name as "gameName", games."categoryId", categories.name as "categoryName" FROM rentals JOIN customers ON customers.id = rentals."customerId" JOIN games ON games.id = rentals."gameId" JOIN categories ON categories.id = games."categoryId"')

        let JoinRentals = rentals.map(obj => ({
          ...obj,
          customer: {id: obj.idCustomer, name: obj.name},
          game: {id: obj.idGame, name: obj.gameName, categoryId: obj.categoryId, categoryName: obj.categoryName},
        }))
        
        for(const rent of JoinRentals){
          delete rent.idCustomer;
          delete rent.name;
          delete rent.idGame
          delete rent.gameName
          delete rent.categoryId;
          delete rent.categoryName
        }
        
        res.send(JoinRentals).status(200)
    } catch (error) {
      console.log(error)
        res.sendStatus(500)
    }
}

async function finishRent(req, res){
  const id = Number(req.params.id)
    try {

      const {rows: rent} = await connection.query(`SELECT rentals."rentDate", rentals."returnDate", rentals."delayFee", rentals."daysRented", rentals."gameId", games."pricePerDay", games."stockTotal"
      FROM rentals
      JOIN games
      ON rentals.id = $1`,[id])

      //Get delay between return date and rent date
      let rentDate = JSON.stringify(rent[0].rentDate).split("T")[0].replace('"',"").replaceAll("-","/")
      rentDate = new Date(rentDate)
      const returnDate = new Date(date)
      const daysRented = Number(rent[0].daysRented)
      let delay = (returnDate.getTime() - rentDate.getTime())
      delay = Math.round(delay/(1000*3600*24))
      let delayFee;

      //Get the delayFee
      if(delay - daysRented >= 0 ){
        delayFee = ((delay - daysRented) * rent[0].pricePerDay) * 100;
      }else{
        delayFee = 0;
      }

         await connection.query(`
         UPDATE rentals SET "returnDate" = '${date}', "delayFee" = ${delayFee} WHERE id = $1`,[id])

        const currentStock = Number(rent[0].stockTotal) + 1

         await connection.query(`
          UPDATE games SET "stockTotal" = ${currentStock} WHERE id = $1`,[rent[0].gameId])

        res.sendStatus(200)
    } catch (error) {
      console.log(error)
        res.sendStatus(500)
    }
}

async function deleteRent(req, res){
  const id = Number(req.params.id)
  try {
    await connection.query(`DELETE FROM rentals WHERE id = $1`,[id])
    res.status(200).send("Rent deleted successfully")
  } catch (error) {
    res.sendStatus(500)
  }
}


export { insertRent, listRentals, finishRent, deleteRent };
