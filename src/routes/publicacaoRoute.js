import { Router } from "express"
import { verifyToken } from "../middleware/verifyToken.js"
import {
    criarPublicacao,
    listarPublicacoes
} from "../controllers/publicacaoController.js"

const router = Router()

router.get("/" , listarPublicacoes)
router.post("/", verifyToken , criarPublicacao)

export default router;