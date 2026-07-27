import { usuarioModel } from "../models/index.js";

export const listarUsuarios = async (req,res) => {
    try {
        const usuarios = await usuarioModel.findAll()
        res.status(200).json(usuarios)
    } catch (error) {
        res.status(500).json(error)
    }
}
export const buscarUsuarioPorId = async (req,res) => {
    try {
        const usuario = await usuarioModel.findByPk(req.params.id)
        if (!usuario) {
            return res.status(404).json({ message: "Usuário não encontrado0!" })
        }
    } catch (error) {
        res.status(500).json(error)
    }
}
export const cadastrarUsuario = async (req,res) => {
    try {
        const usuario = await usuarioModel.create(req.body)
        res.status(200).json(usuario)
    } catch (error) {
        res.status(500).json(error)
    }
}
export const atualizarUsuario = async (req,res) => {
    try {
        const usuario = await usuarioModel.findByPk(req.params.id)
        if (!usuario) {
            return res.status(404).json({ message: "Usuário não encontrado0!" })
        }
        await usuario.update(req.body)
        res.status(200).json(usuario)
    } catch (error) {
        res.status(500).json(error)
    }
}
export const excluirUsuario = async (req,res) => {
    try {
        const usuario = await usuarioModel.findByPk(req.params.id)
        if (!usuario) {
            return res.status(404).json({ message: "Usuário não encontrado0!" })
        }
        await usuario.destroy()
        res.status(204).send()
    } catch (error) {
        res.status(500).json(error)
    }
}