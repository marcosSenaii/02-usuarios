import { usuarioModel } from "../models/index.js";
import { createUserToken } from "../utils/createUserToken.js";
import { tratarErro } from "../utils/errorHandle.js";
import bcrypt from "bcrypt"
import { getToken } from "../utils/getToken.js";
import { getUserByToken } from "../utils/getUserByToken.js";

export const listarUsuarios = async (req,res) => {
    try {
        const usuarios = await usuarioModel.findAll()
        res.status(200).json(usuarios)
    } catch (error) {
        return await tratarErro(error, res)
    }
}
export const buscarUsuarioPorId = async (req,res) => {
    try {
        const usuario = await usuarioModel.findByPk(req.params.id)
        if (!usuario) {
            return res.status(404).json({ message: "Usuário não encontrado!" })
        }
        res.status(200).json(usuario)
    } catch (error) {
        return await tratarErro(error, res)
    }
}
export const cadastrarUsuario = async (req,res) => {
    const { nome, email, idade, senha, verificaSenha } = req.body

    if(senha !== verificaSenha){
        return res.status(401).json({
            message: "As senhas precisam ser iguais"
        });
    }
    try {
        const salt = bcrypt.genSaltSync(12)

        // console.log("salt:",salt)

        const passwordHash = bcrypt.hashSync(senha, salt)

        // console.log("Senha:", senha)
        // console.log("Senha com salt:", passwordHash)

        const dados = {
            nome,
            email,
            senha: passwordHash,
            idade
        }

        const usuario = await usuarioModel.create(dados)
        await createUserToken(usuario, req, res);
        res.status(201).json(usuario)
    } catch (error) {
        return await tratarErro(error, res)
    }
}
export const atualizarUsuario = async (req,res) => {
    const id = req.params.id
    
    try {
        const token = await getToken(req)
        const usuarioToken = await getUserByToken(token)

        if(id != usuarioToken.id){
            return res.status(403).json({ message: "Não autorizado" })
        }

        const usuario = await usuarioModel.findByPk(req.params.id)

        if (!usuario) {
            return res.status(404).json({ message: "Usuário não encontrado!" })
        }

        await usuario.update(req.body)
        
        res.status(200).json(usuario)
    } catch (error) {
        return await tratarErro(error, res)
    }
}
export const excluirUsuario = async (req,res) => {
    try {
        const usuario = await usuarioModel.findByPk(req.params.id)
        if (!usuario) {
            return res.status(404).json({ message: "Usuário não encontrado!" })
        }
        await usuario.destroy()
        res.status(204).send()
    } catch (error) {
        return await tratarErro(error, res)
    }
}