import { ValidationError, UniqueConstraintError } from "sequelize";

export const tratarErro = (error, response) => {
    // error é do tipo da classe ValidationError
    if ( error instanceof UniqueConstraintError ) {
        return response.status(409).json({
            message: error.errors[0].message
        })
    }

    if ( error instanceof ValidationError ) {
        return response.status(400).json({
            message: error.errors[0].message
        })
    }
    console.log(error)
    return response.status(500).json({ message: "Erro interno do servidor" })
}