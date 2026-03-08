import { User } from "../users/user.model.js";

export const getInternalUser = async (authId, email) => {
    let user = await User.findOne({
        where: { auth_id: authId }
    });

    if (!user) {
        user = await User.create({
            auth_id: authId,
            nombre: "Pendiente",
            apellido: "Pendiente",
            correo: email,
            dpi: "PENDIENTE",
            telefono: "PENDIENTE",
            direccion: "PENDIENTE",
            ingresos_mensuales: 0,
            role_id: 2
        });
    }

    return user;
};