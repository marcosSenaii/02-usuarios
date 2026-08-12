import { conn } from "../config/conn.js";
import { DataTypes } from "sequelize"

export const publicacaoModel = conn.define("publicacoes",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        publicacao: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "A publicação é obrigatória"
                },
                len: {
                    args: [3, 255],
                    msg: "A publicação deve conter entre 3 a 255 caracteres"
                }
            }
        },
        usuario_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
    {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
)