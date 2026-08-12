import { usuarioModel } from "./usuarioModel.js";
import { publicacaoModel } from "./publicacaoModels.js";

// Relacionamento das entidades
usuarioModel.hasMany(publicacaoModel, {
    foreignKey: "usuario_id"
})
publicacaoModel.belongsTo(usuarioModel, {
    foreignKey: "usuario_id"
})

export { usuarioModel, publicacaoModel };