import { describe, test, expect, beforeAll } from "vitest";
import { conn } from "../src/config/conn.js";
import app from "../src/app.js";
import request from "supertest";

// Antes de tudo (Before All)
beforeAll(async () => {
    await conn.sync({force: true})
})

const criarUsuario = async (dados = {}) => {
    return await request(app)
        .post("/usuarios")
        .send({
            nome: "Marcos Ferreira",
            email: `usuario${Date.now()}${Math.random()}@email.com`,
            idade: 18,
            ... dados
        })
}

// Suite de testes
describe("GET /usuarios", () => {
    // Casos de teste
    test ("Deve retornar o status 200", async () => {
        const response = await request(app).get("/usuarios")
        expect(response.status).toBe(200)
    })
})

describe("POST /usuarios", () => {
    test ("Deve retornar o status 201 e o objeto criado exatamente com os valores esperados", async () => {
        const dados = {
            nome: "Ferreira",
            email: `ferreira${Date.now()}@gmail.com`,
            idade: 18
        }

        const response = await criarUsuario(dados)

        expect(response.status).toBe(201)
        expect(response.ok).toBeTruthy()

        //Assertivas: toEqual
        expect(response.body).toEqual({
            id: expect.any(Number),
            nome: dados.nome,
            email: dados.email,
            idade: dados.idade
        })

        //Assertiva: toHaveProperty()
        expect(response.body).toHaveProperty("id")
        expect(response.body).toHaveProperty("email", dados.email)

        //Assertiva: toBeDefined
        expect(response.body.id).toBeDefined()
        expect(response.body.senha).toBeUndefined()
    })

    describe("Campos obrigatórios", () => {
        test("Deve retornar 400 quando o nome não for informado", async () => {
            const response = await criarUsuario({
                nome: null
            })

            expect(response.status).toBe(400)
            expect(response.ok).toBeFalsy()
            expect(response.body.message).toBe("usuarios.nome cannot be null")
        })
        test("Deve retornar 400 quando o email não for informado", async () => {
            const response = await criarUsuario({
                email: null
            })

            expect(response.status).toBe(400)
            expect(response.ok).toBeFalsy()
            expect(response.body.message).toBe("usuarios.email cannot be null")
        })
        test("Deve retornar 400 quando a idade não for informado", async () => {
            const response = await criarUsuario({
                idade: null
            })

            expect(response.status).toBe(400)
            expect(response.ok).toBeFalsy()
            expect(response.body.message).toBe("usuarios.idade cannot be null")
        })
    })

    describe("Validações dos Campos", () => {
        test("Deve retornar status 400 quando nome possuir menos de 3 caracteres", async () => {
            const response = await criarUsuario({
                nome: "A".repeat(2)
            })

            expect(response.status).toBe(400)
            expect(response.body.message).toBe("O nome deve possuir entre 3 e 100 caracteres")
        })
        test("Deve retornar status 400 quando nome possuir mais que 100 caracteres", async () => {
            const response = await criarUsuario({
                nome: "A".repeat(121)
            })

            expect(response.status).toBe(400)
            expect(response.body.message).toBe("O nome deve possuir entre 3 e 100 caracteres")
        })
        test("Deve retornar status 400 quando email for inválido", async () => {
            const emailInvalido = "email inválido"
            const response = await criarUsuario({
                email: emailInvalido
            })

            expect(response.status).toBe(400)
            expect(response.body.message).toBe("Informe um email válido")

            const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            expect(emailInvalido).not.toMatch(regexEmail) // Assrtiva toMatch
        })
        test("Deve retornar status 400 quando a idade for menor que 18 anos", async () => {
            const idadeInvalida = 17
            const response = await criarUsuario({
                idade: idadeInvalida
            })

            expect(response.status).toBe(400)
            expect(response.body.message).toBe("A idade mínima permitida é 18 anos")
            expect(idadeInvalida).toBeLessThan(18)
        })
        test("Deve retornar status 400 quando a idade não for um número inteiro", async () => {
            const idadeInvalida = "abc"
            const response = await criarUsuario({
                idade: idadeInvalida
            })

            expect(response.status).toBe(400)
            expect(response.body.message).toBe("A idade deve ser um número inteiro")
        })
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