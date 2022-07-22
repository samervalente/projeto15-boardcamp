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

        if(req.query.cpf){
            const cpf = req.query.cpf
            const {rows: customer} = await connection.query(`SELECT * FROM customers WHERE cpf LIKE '${cpf}%' `)
            return res.send(customer).status(200)
        }

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

async function updateCustomer(req, res){
    const customer = req.body
    const id = Number(req.params.id)
    try {
        await connection.query(
         `UPDATE customers SET name='${customer.name}', phone='${customer.phone}', cpf='${customer.cpf}', birthday='${customer.birthday}' WHERE id = $1`,[id])
         res.sendStatus(200)
    } catch (error) {
        res.sendStatus(500)
    }
}

export {insertCustomer, listCustomers, listCustomersById, updateCustomer}