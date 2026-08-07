import { usuarioModel } from "../models/index.js";
import bcrypt from "bcrypt"
import { tratarErro } from "../utils/errorHandle.js";
import { createUserToken } from "../utils/createUserToken.js";

export const login = async (req, res) => {
    const { email, senha } = req.body;
    try {
        const usuarioEncontrado = await usuarioModel.scope("comSenha").findOne({
            where: {
                email
            }
        })

        if(!usuarioEncontrado){
            return res.status(404).json({
                message: "Credenciais inválidas"
            })
        }

        const comparaSenha = bcrypt.compareSync(senha, usuarioEncontrado.senha)

        if(!comparaSenha){
            return res.status(401).json({
                message: "Credenciais inválidas"
            })
        }
        
        // Criar o token
        await createUserToken(usuarioEncontrado, req, res);
    } catch (error) {
        await tratarErro(error, res)
    }
}