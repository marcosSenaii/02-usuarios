import { publicacaoModel, usuarioModel } from "../models/index.js"
import { getToken } from "../utils/getToken.js"
import { getUserByToken } from "../utils/getUserByToken.js"
import { tratarErro } from "../utils/errorHandle.js"

export const criarPublicacao = async (req, res) => {
    const { publicacao } = req.body;

    try {
        const token = await getToken(req)
        const usuarioToken = await getUserByToken(token)

        const data = {
            publicacao,
            usuario_id: usuarioToken.id
        }

        await publicacaoModel.create(data)

        res.status(201).json({ message: "Publicação criada com sucesso "})
    } catch (error) {
        await tratarErro(error, res)
    }
}

export const listarPublicacoes = async (req, res) => {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 9
    const offset = (page - 1) * limit
    const usuario_id = req.query.usuario_id

    const where = {}

    if(usuario_id){
        where.usuario_id = usuario_id
    }

    try {
        const { count, rows } = await publicacaoModel.findAndCountAll({
            where,
            attributes: {
                exclude: ["created_at", "updated_at"]
            },
            include: {
                model: usuarioModel,
                attributes: {
                    exclude: ["id", "senha", "email"]
                }
            },
            limit,
            offset
        })

        res.status(200).json({
            results: rows
        })
    } catch (error) {
        await tratarErro(error, res)
    }
}

export const buscarPublicacaoPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const publicacao = await publicacaoModel.findByPk(id, {
            attributes: {
                exclude: ["usuario_id"]
            },
            include: {
                model: usuarioModel,
                attributes: {
                    exclude: ["id", "email", "senha", "idade"]
                }
            }
        })
        
        if(!publicacao){
            return res.status(404).json({
                message: "Publicação não encontrada"
            })
        }

        res.status(200).json(publicacao)
    } catch (error) {
        await tratarErro(error, res)
    }
}

export const atualizarPublicacao = async (req, res) => {
    const { id } = req.params;
    const { publicacao } = req.body;

    try {
        const token = await getToken(req)
        const userToken = await getUserByToken(token)

        const publicacaoEncontrada = await publicacaoModel.findByPk(id)
        if (!publicacaoEncontrada) {
            return res.status(404).json({ message: "Publicação não encontrada!" })
        }

        if (publicacaoEncontrada.usuario_id != usuarioToken.id) {
            return res.status(403).json({ message: "Você não tem permissão para editar essa publicação" })
        }

        await publicacaoEncontrada.update({
            publicacao
        })

        res.status(200).json({
            message: "Publicação atualizada"
        })
    } catch (error) {
        await tratarErro(error, res)
    }
}

export const deletarPublicacao = async (req, res) => {
    const { id } = req.params

    try {
        const token = await getToken(req)
        const usuarioToken = await getUserByToken(token)

        const publicacao = await publicacaoModel.findByPk(id)

        if (!publicacao) {
            return res.status(404).json({ message: "Publicação não encontrada!" })
        }

        if (publicacao.usuario_id != usuarioToken.id) {
            return res.status(403).json({ message: "Você não tem permissão para editar essa publicação" })
        }

        await publicacao.destroy()

        res.status(200).json({ message: "Publicação deletada" })
    } catch (error) {
        await tratarErro(error, res)
    }
}