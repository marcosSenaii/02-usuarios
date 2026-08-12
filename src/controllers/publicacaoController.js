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