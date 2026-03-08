import { AccountRequest } from "./accountRequest.model.js";
import { getInternalUser } from "../utils/getInternalUser.js";

export const createAccountRequest = async (req, res) => {
    try {
        const { tipo, dpi, fullName, phone, email } = req.body;
        const internalUser = await getInternalUser(req.user.id, req.user.email);

        if (internalUser.dpi !== dpi) {
            return res.status(400).json({
                message: "El DPI ingresado no coincide con el usuario autenticado."
            });
        }

        if (internalUser.nombre !== fullName) {
            return res.status(400).json({
                message: "El nombre ingresado no coincide con el usuario autenticado."
            });
        }

        if (internalUser.correo !== email) {
            return res.status(400).json({
                message: "El email ingresado no coincide con el usuario autenticado."
            });
        }

        const existing = await AccountRequest.findOne({
            where: {
                user_id: internalUser.id,
                tipo,
                status: "PENDIENTE"
            }
        });

        if (existing) {
            return res.status(400).json({
                message: "Ya tienes una solicitud pendiente de este tipo."
            });
        }

        const request = await AccountRequest.create({
            user_id: internalUser.id,
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
        const internalUser = await getInternalUser(req.user.id, req.user.email);

        const requests = await AccountRequest.findAll({
            where: { user_id: internalUser.id },
            order: [["createdAt", "DESC"]]
        });

        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};