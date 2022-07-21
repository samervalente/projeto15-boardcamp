import joi from "joi"

const gameSchema = joi.object(
    {
        name:joi.string().required(),
        image: joi.string().pattern(/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/im).required(),
        pricePerDay: joi.number().greater(0).required(),
        stockTotal: joi.number().greater(0).required(),
        categoryId: joi.number().required()
      }
)

export default gameSchema