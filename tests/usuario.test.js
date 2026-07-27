import { describe, test, expect, beforeAll } from "vitest";
import { conn } from "../src/config/conn.js";
import app from "../src/app.js";
import request from "supertest";

// Antes de tudo (Before All)
beforeAll(async () => {
    await conn.sync({force: true})
})

// Suite de testes
describe("GET /usuarios", () => {
    // Casos de teste
    test ("Deve retornar o status 200", async () => {
        const response = await request(app).get("/usuarios")
        expect(response.status).toBe(200)
    })
})

describe("POST /usuarios", () => {
    test ("Deve retornar o status 201", async () => {
        const response = await request(app)
        .post("/usuarios")
        .send({
            nome: "Marcos",
            email: "xmsnolcdmol@gmail.com",
            idade: 18
        })
        expect(response.status).toBe(201)
    })
})

describe("GET /usuarios/:id", () => {
    // Casos de teste
    test ("Deve retornar o status 200", async () => {
        const response = await request(app).get("/usuarios/1")
        expect(response.status).toBe(200)
    })

    test ("Deve retornar o status 404 caso o ID do usuário não existe", async () => {
        const response = await request(app).get("/usuarios/2")
        expect(response.status).toBe(404)
    })

    test ("Deve retornar 'Usuário não encontrado!' caso o ID do usuário não exista", async () => {
        const response = await request(app).get("/usuarios/2")
        expect(response.body.message).toBe("Usuário não encontrado!")
    })
})

describe("PUT /usuarios/:id", () => {
    // Casos de teste
    test ("Deve retornar o status 200", async () => {
        const response = await request(app)
        .put("/usuarios/1")
        .send({
            nome: "Ferreira"
        })
        expect(response.status).toBe(200)
    })

    test ("Deve retornar o status 404 caso o ID do usuário não existe", async () => {
        const response = await request(app).put("/usuarios/2")
        expect(response.status).toBe(404)
    })

    test ("Deve retornar 'Usuário não encontrado!' caso o ID do usuário não exista", async () => {
        const response = await request(app).put("/usuarios/2")
        expect(response.body.message).toBe("Usuário não encontrado!")
    })
})

describe("DELETE /usuarios/:id", () => {
    // Casos de teste
    test ("Deve retornar o status 204", async () => {
        const response = await request(app).delete("/usuarios/1")
        expect(response.status).toBe(204)
    })

    test ("Deve retornar o status 404 caso o ID do usuário não existe", async () => {
        const response = await request(app).delete("/usuarios/2")
        expect(response.status).toBe(404)
    })

    test ("Deve retornar 'Usuário não encontrado!' caso o ID do usuário não exista", async () => {
        const response = await request(app).delete("/usuarios/2")
        expect(response.body.message).toBe("Usuário não encontrado!")
    })
})