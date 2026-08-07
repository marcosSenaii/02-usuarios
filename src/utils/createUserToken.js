import jwt from "jsonwebtoken";
import { tratarErro } from "./errorHandle.js";

const senhaToken = "SENHASUPERSEGURA"

export const createUserToken = async (usuario, req, res) => {
    try {
        const token = jwt.sign(
            {
                id: usuario.id,
                email: usuario.email,
                idade: usuario.idade
            },
            senhaToken,
            {
                expiresIn: "12h"
            }
        )

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Você está autenticado",
            token,
            usuarioId: usuario.id
        })
    } catch (error) {
        await tratarErro(error, res)
    }
}