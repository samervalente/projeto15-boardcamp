import joi from "joi"

const customerSchema = joi.object({
  name: joi.string().required(),
  phone: joi.string().min(10).max(11).required() ,
  cpf: joi.string().min(11).max(11).required(),
  birthday: joi.date().greater('1-1-1920')
})

export default customerSchema