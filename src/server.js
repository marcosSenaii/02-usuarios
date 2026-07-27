import app from "./app.js";

const PORT = 3333

const iniciarServidor = async () => {
    try {
        app.listen(PORT, () => {
            console.log(`Server running on: http://localhost:${PORT}`)
        })
    } catch (error) {
        console.log("Erro ao iniciar servidor:", error.message)
    }
}

await iniciarServidor()