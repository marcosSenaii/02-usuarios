import { tratarErro } from "../utils/errorHandle.js";
import { getToken } from "../utils/getToken.js";
import jwt from 'jsonwebtoken'

export const verifyToken = async (req, res, next) => {
    try {
        if(!req.headers.authorization){
            return res.status(401).json({
                message: "O cabeçalho 'Authorization' é obrigatório e deve conter um token Bearer"
            });
        };

        const token = await getToken(req)
        
        if(!token){
            return res.status(401).json({
                message: "Verifique se o token está presente"
            })
        }

        let verifed

        try {
            verifed = jwt.verify(token, "SENHASUPERSEGURA")
            console.log(verifed)
        } catch (JwtError) {
            let message
            if(JwtError.name = "TokenExpiredError"){
                message = "Token expirado. Por favor, faça login novamente."
            } else if (JwtError.name === "JsonWebTokenError") {
                message = "Token Inválido. O token não confere com a chave de validação, ou o token foi adulterado"
            } else {
                message = "Erro ao validar token"
            }
            res.status(401).json({
                message
            })
        }
        req.usuario = verifed
        next()
    } catch (error) {
        await tratarErro(error, res)
    }
}