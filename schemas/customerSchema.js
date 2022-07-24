import joi from "joi"
import joiDate from '@hapi/joi-date';



const customerSchema = joi.object({
  name: joi.string().required(),
  phone: joi.string().min(10).max(11).required() ,
  cpf: joi.string().min(11).max(11).required(),
  birthday: joi.date().required()
 
})

export default customerSchema