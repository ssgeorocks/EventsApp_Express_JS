import { userModel } from "../models/userModels.js";

export class UsersDAO {
    async create(usuario) {
        let nuevoUsuario = await userModel.create(usuario);
        return nuevoUsuario.toJSON();
    }

    async getBy(filtro) {
        return await userModel.findOne(filtro).lean();
    }
}
