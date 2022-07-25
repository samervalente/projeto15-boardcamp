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
 
    await connection.query(`UPDATE games SET "stockTotal"=${currentStock} WHERE id = ${gameId}`);

    res.send(rent).status(200);
  } catch (error) {
  
    res.sendStatus(500);
  }
}

async function listRentals(req, res){
    
    try {
        let rentals;
    
        //Select rentals by customer id
        if(req.query.customerId || req.query.gameId){
          
          let query;
          if(req.query.customerId) query = {key: 'customerId', value: req.query.customerId}
          if(req.query.gameId) query = {key: 'gameId', value:req.query.gameId}

          const {rows: rentalsByQueryString} = await connection.query(`SELECT rentals.*, customers.id as "idCustomer", customers.name, games.id as "idGame", games.name as "gameName", games."categoryId", categories.name as "categoryName" FROM rentals JOIN customers ON customers.id = rentals."customerId" JOIN games ON games.id = rentals."gameId" JOIN categories ON categories.id = games."categoryId"
          WHERE rentals."${query.key}" = $1`,[query.value])
           
          rentals = rentalsByQueryString;
        }
        
        //Select all games
        if(!req.query.customerId && !req.query.gameId){
          const {rows: allRentals} = await connection.query('SELECT rentals.*, customers.id as "idCustomer", customers.name, games.id as "idGame", games.name as "gameName", games."categoryId", categories.name as "categoryName" FROM rentals JOIN customers ON customers.id = rentals."customerId" JOIN games ON games.id = rentals."gameId" JOIN categories ON categories.id = games."categoryId"')
          
          rentals = allRentals     
        }
        
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
            delete rent.categoryName;
          }
        
        res.send(JoinRentals).status(200)

    } catch (error) {
      
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
