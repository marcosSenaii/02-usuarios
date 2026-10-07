import jwt from "jsonwebtoken"
import { usuarioModel } from "../models/index.js"

export const getUserByToken = async (token) => {
    if(!token){
        throw new Error("Token não fornecido")
    }

    const decoded = jwt.verify(token, "SENHASUPERSEGURA")
    const usuario = await usuarioModel.findByPk(decoded.id)
    if(!usuario){
        throw new Error("Usuário não encontrado")
    }

    return usuario
}