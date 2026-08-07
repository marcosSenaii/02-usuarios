import { Router } from "express";
import {
    login
} from "../controllers/autenticacaoController.js";

const router = Router()

router.post("/login", login)

export default router;

