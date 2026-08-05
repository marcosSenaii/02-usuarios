import { usuarioModel } from "../models/index.js";
import { tratarErro } from "../utils/errorHandle.js";

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
    try {
        const usuario = await usuarioModel.create(req.body)
        res.status(201).json(usuario)
    } catch (error) {
        return await tratarErro(error, res)
    }
}
export const atualizarUsuario = async (req,res) => {
    try {
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