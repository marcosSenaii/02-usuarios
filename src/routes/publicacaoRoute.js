import { Router } from "express"
import { verifyToken } from "../middleware/verifyToken.js"
import {
    criarPublicacao,
    listarPublicacoes,
    buscarPublicacaoPorId,
    atualizarPublicacao,
    deletarPublicacao
} from "../controllers/publicacaoController.js"

const router = Router()

router.get("/" , listarPublicacoes)
router.post("/", verifyToken , criarPublicacao)
router.get("/:id" , buscarPublicacaoPorId)
router.put("/:id", verifyToken , atualizarPublicacao)
router.delete("/:id", verifyToken , deletarPublicacao)

export default router;