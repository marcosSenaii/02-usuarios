import { describe, test, expect, beforeAll } from "vitest";
import { conn } from "../src/config/conn.js";
import app from "../src/app.js";
import request from "supertest";
import { usuarioModel } from "../src/models/usuarioModel.js";

beforeAll(async () => {
    await conn.sync({ force: true })
})

describe("POST /auth/login", () => {
    test ("Deve fazer login com sucesso e retorna o token", async () => {
        const email = `auth${Date.now()}@email.com`
        const senha = "SENHASUPERSEGURA"

        await request(app).post("/usuarios")
        .send({
            nome: "Usuário Autenticado",
            email,
            idade: 25,
            senha,
            verificaSenha: senha
        })

        const response = await request(app).post("/auth/login")
        .send({
            email,
            senha
        })

        expect(response.status).toBe(200)
        expect(response.ok).toBeTruthy()
        expect(response.body).toHaveProperty("token")
        // expect(response).toHaveProperty("sucesso", true)
    })
    test ("Deve retorna 401 para senha incorreta", async () => {
        const email = `auth${Date.now()}@email.com`
        const senha = "SENHASUPERSEGURA"

        await request(app).post("/usuarios")
        .send({
            nome: "Usuário Autenticado",
            email,
            idade: 25,
            senha,
            verificaSenha: senha
        })

        const response = await request(app).post("/auth/login")
        .send({
            email,
            senha: "Senha incorreta"
        })

        expect(response.status).toBe(401)
        expect(response.body.message).toBe("Credenciais inválidas")
    })

    test ("Deve retornar 404 para email não cadastrado", async () => {
        const response = await request(app).post("/auth/login")
        .send({
            email: "EmailIncorreto@email.com",
            senha: "qlqr senha"
        })

        expect(response.status).toBe(404)
        expect(response.body.message).toBe("Credenciais inválidas")
    })
})