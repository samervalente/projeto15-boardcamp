import connection from "../database/postgre.js";
import dayjs from "dayjs"
import 'dayjs/locale/de.js' 

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
        price * daysRented * 100
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

          return res.send(rentalsCustomer)
        }

        if(req.query.gameId){
          const {rows: gamesId} = await connection.query(`SELECT rentals.*, customers.id as "idCustomer", customers.name, games.id as "idGame", games.name as "gameName", games."categoryId", categories.name as "categoryName" FROM rentals JOIN customers ON customers.id = rentals."customerId" JOIN games ON games.id = rentals."gameId" JOIN categories ON categories.id = games."categoryId"
          WHERE rentals."gameId" = $1`,[req.query.gameId])

          return res.send(gamesId)

        }

        const {rows: rentals} = await connection.query('SELECT rentals.*, customers.id as "idCustomer", customers.name, games.id as "idGame", games.name as "gameName", games."categoryId", categories.name as "categoryName" FROM rentals JOIN customers ON customers.id = rentals."customerId" JOIN games ON games.id = rentals."gameId" JOIN categories ON categories.id = games."categoryId"')
        res.send(rentals).status(200)
    } catch (error) {
    
        res.sendStatus(500)
    }
}

async function finishRent(req, res){
  const id = Number(req.params.id)
    try {
        await connection.query(`UPDATE rentals SET "returnDate" = '${date}' WHERE id = $1`,[id])

        res.sendStatus(200)
    } catch (error) {
      console.log(error)
        res.sendStatus(500)
    }
}


export { insertRent, listRentals, finishRent };
