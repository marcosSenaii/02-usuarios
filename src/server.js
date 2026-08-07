import "./models/index.js";
import app from "./app.js";
import { conn } from "./config/conn.js";

const PORT = 3333

const iniciarServidor = async () => {
    try {
        //await conn.sync({ force: true })
        await conn.sync();
        app.listen(PORT, () => {
            console.log(`Server running on: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.log("Erro ao iniciar servidor:", error.message);
    }
}

await iniciarServidor();