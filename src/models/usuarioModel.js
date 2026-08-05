import { DataTypes } from "sequelize";
import { conn } from "../config/conn.js";

export const usuarioModel = conn.define("usuarios",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "O nome é obrigatório"
                },
                len: {
                    args: [3, 100],
                    msg: "O nome deve possuir entre 3 e 100 caracteres"
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: "Já existe um usuário cadastrado com esse email"
            },
            validate: {
                notEmpty: {
                    msg: "O nome é obrigatório"
                },
                isEmail: {
                    msg: "Informe um email válido"
                }
            }
        },
        idade: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "A idade é obrigatória"
                },
                isInt: {
                    msg: "A idade deve ser um número inteiro"
                },
                min: {
                    args: 18,
                    msg: "A idade mínima permitida é 18 anos"
                },
                max: {
                    args: 120,
                    msg: "A idade máxima permitida é 120 anos"
                }
            }
        }
    },
    {
        timestamps: false
    }
)