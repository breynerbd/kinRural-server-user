import { User } from "./user.model.js";
import { getInternalUser } from "../utils/getInternalUser.js";

export const getUserProfile = async (req, res, next) => {
    try {
        const internalUser = await getInternalUser(req.user.id, req.user.email);

        if (!internalUser)
            return res.status(404).json({ success: false, message: "Perfil no encontrado" });

        res.status(200).json({ success: true, user: internalUser });

    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req, res, next) => {
    try {
        const internalUser = await getInternalUser(req.user.id, req.user.email);

        if (!internalUser) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        const allowedFields = [
            "nombre",
            "apellido",
            "dpi",
            "correo",
            "telefono",
            "direccion",
            "ingresos_mensuales"
        ];

        const updates = {};

        for (const key of allowedFields) {
            if (req.body[key] !== undefined) {
                updates[key] = req.body[key];
            }
        }

        await internalUser.update(updates);

        res.status(200).json({
            success: true,
            user: internalUser
        });

    } catch (error) {
        next(error);
    }
};
