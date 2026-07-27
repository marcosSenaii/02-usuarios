import { Router } from "express";
import {
    listarUsuarios,
    buscarUsuarioPorId,
    cadastrarUsuario,
    atualizarUsuario,
    excluirUsuario
} from "../controllers/usuarioController.js";

const router = Router();

router.get("/", listarUsuarios);
router.get("/:id", buscarUsuarioPorId);
router.post("/", cadastrarUsuario);
router.put("/:id", atualizarUsuario);
router.delete("/:id", excluirUsuario);

export default router