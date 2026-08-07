import { describe, test, expect, beforeAll } from "vitest";
import { conn } from "../src/config/conn.js";
import app from "../src/app.js";
import request from "supertest";
import { usuarioModel } from "../src/models/usuarioModel.js";

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
    test ("Deve retornar o status 200 e a lista de usuário com as propriedades corretas", async () => {
        // ter dados > listar esses dados > comparar os dados listados com o do banco
        await usuarioModel.destroy({ where: {}, truncate: true })
        await criarUsuario({ nome: "Marcos", email: "marcos@email.com", idade: 18 })
        await criarUsuario({ nome: "Ferreira", email: "ferreira@email.com", idade: 18 })

        const response = await request(app).get("/usuarios")
        
        expect(response.status).toBe(200)
        expect(response.ok).toBeTruthy()
        expect(response.body).toHaveLength(2)

        const emails = response.body.map((usuario) => usuario.email)
        expect(emails).toContain("marcos@email.com")
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
        const usuario = await criarUsuario()
        
        const response = await request(app).get(`/usuarios/${usuario.body.id}`)
        expect(response.status).toBe(200)
        expect(response.ok).toBeTruthy()
        expect(response.body).toEqual(usuario.body)
    })

    test ("Deve retornar o status 404 caso o ID do usuário não existe", async () => {
        const response = await request(app).get("/usuarios/999")
        expect(response.status).toBe(404)
        expect(response.ok).toBeFalsy()
    })

    test ("Deve retornar 'Usuário não encontrado!' caso o ID do usuário não exista", async () => {
        const response = await request(app).get("/usuarios/777")
        expect(response.body.message).toBe("Usuário não encontrado!")
        expect(response.ok).toBeFalsy()
    })
})

describe("PUT /usuarios/:id", () => {
    // Casos de teste
    test ("Deve retornar o status 200", async () => {
        const usuario = await criarUsuario()
        const dadosAtualizados = {
            id: usuario.body.id,
            nome: "Ferreira",
            email: "ferreira123@email.com",
            idade: 18
        }

        const response = await request(app)
        .put(`/usuarios/${usuario.body.id}`)
        .send(dadosAtualizados)

        expect(response.status).toBe(200)
        expect(response.ok).toBeTruthy()
        expect(response.body).toEqual(dadosAtualizados)
    })

    test ("Deve retornar o status 404 caso o ID do usuário não existe", async () => {
        const response = await request(app).put("/usuarios/999").send({
            nome: "Ferreira",
            email: "ferreira@email.com",
            idade: 18
        })

        expect(response.status).toBe(404)
        expect(response.ok).toBeFalsy()
    })

    test ("Deve retornar 'Usuário não encontrado!' caso o ID do usuário não exista", async () => {
        const response = await request(app).put("/usuarios/999")
        expect(response.body.message).toBe("Usuário não encontrado!")
        expect(response.ok).toBeFalsy()
    })
})

describe("DELETE /usuarios/:id", () => {
    // Casos de teste
    test ("Deve retornar o status 204", async () => {
        const usuario = await criarUsuario()

        const response = await request(app).delete(`/usuarios/${usuario.body.id}`)
        expect(response.status).toBe(204)
        expect(response.ok).toBeTruthy()
    })

    test ("Deve retornar o status 404 caso o ID do usuário não existe", async () => {
        const response = await request(app).delete("/usuarios/777")
        expect(response.status).toBe(404)
        expect(response.ok).toBeFalsy()
    })

    test ("Deve retornar 'Usuário não encontrado!' caso o ID do usuário não exista", async () => {
        const response = await request(app).delete("/usuarios/777")
        expect(response.body.message).toBe("Usuário não encontrado!")
        expect(response.ok).toBeFalsy()
    })
})