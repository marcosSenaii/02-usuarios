import { Sequelize } from "sequelize";

export const conn = new Sequelize('usuarios3G', 'root', '123456789', {
    host: 'localhost',
    dialect: 'mysql'
})