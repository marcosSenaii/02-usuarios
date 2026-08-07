import { Router } from "express";
import {
    listarUsuarios,
    buscarUsuarioPorId,
    cadastrarUsuario,
    atualizarUsuario,
    excluirUsuario
} from "../controllers/usuarioController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();

router.get("/", listarUsuarios);
router.get("/:id", buscarUsuarioPorId);
router.post("/", cadastrarUsuario);
router.put("/:id", verifyToken, atualizarUsuario);
router.delete("/:id", verifyToken, excluirUsuario);

export default router