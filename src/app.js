import express from 'express';
import cors from 'cors';
import usuarioRoutes from "./routes/usuariosRoutes.js"
import autenticacaoRoutes from "./routes/autenticacaoRoute.js";

const app = express();

app.use(cors({
    origin: '*',
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
}))

app.use(express.json());

app.use("/usuarios", usuarioRoutes)
app.use("/auth", autenticacaoRoutes)

app.use((req, res) => {
    res.status(404).json({ message: 'Rota não encontrada' });
});

export default app;