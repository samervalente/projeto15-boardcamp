import connection from "../database/postgre.js";

async function insertCustomer(req, res){
    const customer = req.body
   
    try {
        
        await connection.query(`INSERT INTO customers (name, phone, cpf, birthday) VALUES ('${customer.name}','${customer.phone}','${customer.cpf}','${customer.birthday}')`)
        res.send(customer).status(201)
    } catch (error) {
        res.sendStatus(500)
    }
}

async function listCustomers(req, res){
    try {
        const {rows: customers} = await connection.query("SELECT * FROM customers")
        res.send(customers).status(200)
    } catch (error) {
        res.sendStatus(500)
    }
}

async function listCustomersById(req,res){
    const id = Number(req.params.id)
    try {
        const {rows: customer} = await connection.query(`SELECT * FROM customers WHERE id = $1`, [id])
        res.send(customer).status(200)
    } catch (error) {
        res.sendStatus(500)
    }
}

export {insertCustomer, listCustomers, listCustomersById}