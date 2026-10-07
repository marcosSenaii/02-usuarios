import { describe, test, expect, beforeAll } from "vitest";
import { conn } from "../src/config/conn.js";
import app from "../src/app.js";
import request from "supertest";
import { usuarioModel } from "../src/models/usuarioModel.js";

beforeAll( async () => {
    await conn.sync({ force: true })
})

const criarPublicacao = async (quantidade) => {
    const usuario = await request(app)
        .post("/usuarios")
        .send({
            nome: "Marcos Ferreira",
            email: `usuario${Date.now()}${Math.random()}@email.com`,
            idade: 18,
            senha: "12345678",
            verificaSenha: "12345678"
    })

    for (let i = 1; i <= quantidade; i++) {
        await request(app)
            .post("/publicacoes")
            .set("Authorization", `Bearer ${usuario.body.token}`)
            .send({ publicacao: "Nova publicação" })
    }
}

const usuarioNovo = async (quantidade) => {
    const usuario = await request(app)
        .post("/usuarios")
        .send({
            nome: "devferreira",
            email: `usuario${Date.now()}${Math.random()}@email.com`,
            idade: 18,
            senha: "12345678",
            verificaSenha: "12345678"
    })

    for (let i = 1; i <= quantidade; i++) {
        await request(app)
            .post("/publicacoes")
            .set("Authorization", `Bearer ${usuario.body.token}`)
            .send({ publicacao: "Nova publicação" })
    }
}

describe("Rota GET (Listar publicações) | GET: /publicacoes", () => {
    test("Teste 1: Listar publicações com sucesso", async () => {
        const response = await request(app).get("/publicacoes")
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("info")
        expect(response.body).toHaveProperty("results")
        expect(response.body.info).toHaveProperty("count")
        expect(response.body.info).toHaveProperty("page")
        expect(response.body.results).toBeInstanceOf(Array)
    })

    test("Teste 2: Verificar dados do usuário", async () => {
        const publicacao = await criarPublicacao(1)

        const response = await request(app).get("/publicacoes")

        expect(response.status).toBe(200)
        expect(response.body.results[0].id).toBeDefined()
        expect(response.body.results[0].usuario.nome).toBeDefined()
        expect(response.body.results[0].usuario.senha).toBeUndefined()
        expect(response.body.results[0].usuario.email).toBeUndefined()
        expect(response.body.results[0].usuario.idade).toBeUndefined()
    })

    test("Teste 3: Verificar paginação", async () => {
        const publicacao = await criarPublicacao(1)

        const response = await request(app).get("/publicacoes?page=1&limit=2")

        console.log(response.body)

        expect(response.status).toBe(200)
        expect(response.body.results).toHaveLength(2)
        expect(response.body.info.count).toBe(2)
        expect(response.body.info.page).toBe(1)
    })

    test("Teste 4: Buscar segunda página", async () => {
        const publicacao = await criarPublicacao(3)
        const response = await request(app).get("/publicacoes?page=2&limit=2")
        console.log(response.body)
        expect(response.status).toBe(200)
        expect(response.body).toEqual(
            {
                "info": {
                    "page": 2,
                    "count": 5
                },
                "results": [
                    {
                        "id": 3,
                        "publicacao": "Nova publicação",
                        "usuario_id": 3,
                        "usuario": {
                            "nome": "Marcos Ferreira"
                        }
                    },
                    {
                        "id": 4,
                        "publicacao": "Nova publicação",
                        "usuario_id": 3,
                        "usuario": {
                            "nome": "Marcos Ferreira"
                        }
                    }
                ]
            }
        )

    })

    test("Teste 5: Filtrar por usuário", async () => {
        const response = await request(app).get("/publicacoes?usuario_id=1")

         expect(response.status).toBe(200)
    })

    test("Teste 6: Filtrar por outro usuário", async () => {
        const criarUsuario = usuarioNovo(1)
        const response = await request(app).get("/publicacoes?usuario_id=2")

         expect(response.status).toBe(200)
    })

    // Desculpa professor agora é 14:52 e eu tenho que sair de 15:10, não vai dar tempo de terminar
})