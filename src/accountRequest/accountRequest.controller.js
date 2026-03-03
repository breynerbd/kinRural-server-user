import { AccountRequest } from "./accountRequest.model.js";
import { User } from "../users/user.model.js";
// =============================
// Usuario solicita cuenta
// =============================
export const createAccountRequest = async (req, res) => {
    try {
        const { tipo, dpi, fullName, phone, email } = req.body;

        // 🔹 Obtener usuario logueado desde base de datos
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado."
            });
        }

        // 🔹 Validar que el DPI coincida
        if (user.dpi !== dpi) {
            return res.status(400).json({
                message: "El DPI ingresado no coincide con el usuario autenticado."
            });
        }

        // 🔹 Validar que el nombre coincida
        if (user.nombre !== fullName) {
            return res.status(400).json({
                message: "El nombre ingresado no coincide con el usuario autenticado."
            });
        }

        //validar que el email coincida
        if (user.correo !== email) {
            return res.status(400).json({
                message: "El email ingresado no coincide con el usuario autenticado."
            });
        }

        // 🔹 Validar solicitud pendiente
        const existing = await AccountRequest.findOne({
            where: {
                user_id: req.user.id,
                tipo,
                status: "PENDIENTE"
            }
        });

        if (existing) {
            return res.status(400).json({
                message: "Ya tienes una solicitud pendiente de este tipo."
            });
        }

        // 🔹 Crear solicitud
        const request = await AccountRequest.create({
            user_id: req.user.id,
            tipo,
            dpi,
            fullName,
            phone,
            email
        });

        res.status(201).json({
            message: "Solicitud enviada correctamente.",
            request
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getMyRequests = async (req, res) => {
    try {
        const requests = await AccountRequest.findAll({
            where: { user_id: req.user.id },
            order: [["createdAt", "DESC"]]
        });

        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
