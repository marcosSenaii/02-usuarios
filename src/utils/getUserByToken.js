import jwt from "jsonwebtoken"
import { usuarioModel } from "../models/index.js"

export const getUserByToken = async (token) => {
    return new Promise(async (resolve, reject) => {
        if(!token){
            return resolve.status(401).json({ message: "Acesso negado" })
        }

        const decoded = jwt.verify(token, "SENHASUPERSEGURA")
        const usuario = await usuarioModel.findByPk(decoded.id)

        if(!usuario){
            reject({ error: "Error ao buscar usuário" })
        }else{
            resolve(usuario)
        }
    })
}