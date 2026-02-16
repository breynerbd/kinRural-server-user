import { User } from "../../../kinRural-server-admin/src/users/user.model.js";

export const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id); // Solo trae su propio usuario
        if (!user) return res.status(404).json({ success: false, message: "Usuario no encontrado" });

        res.status(200).json({ success: true, user });
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req, res, next) => {
    try {
        const { id } = req.user;
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ success: false, message: "Usuario no encontrado" });
        }

        // Campos permitidos para actualizar
        const allowedFields = ["nombre", "apellido", "correo", "telefono", "direccion"];
        const updates = {};
        for (const key of allowedFields) {
            if (req.body[key] !== undefined) updates[key] = req.body[key];
        }

        await user.update(updates);
        res.status(200).json({ success: true, user });

    } catch (error) {
        next(error);
    }
};
