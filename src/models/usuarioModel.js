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
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        },
        idade: {
            type: DataTypes.INTEGER
        }
    },
    {
        timestamps: false
    }
)