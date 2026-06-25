import { AccountRequest } from "./accountRequest.model.js";
import { getInternalUser } from "../utils/getInternalUser.js";

export const createAccountRequest = async (req, res) => {
  try {
    const { tipo, dpi, fullName, phone, email } = req.body;
    const internalUser = await getInternalUser(
      req.user.auth_id,
      req.user.email,
    );

    // 1. Validación de DPI
    if (internalUser.dpi !== dpi) {
      return res.status(400).json({
        message: "El DPI ingresado no coincide con el usuario autenticado.",
      });
    }

    // 🔥 CAMBIO AQUÍ: Concatenamos de forma idéntica al frontend para validar el nombre completo
    const dbFullName = internalUser.apellido
      ? `${internalUser.nombre} ${internalUser.apellido}`.trim()
      : internalUser.nombre
        ? internalUser.nombre.trim()
        : "";

    if (dbFullName !== fullName?.trim()) {
      return res.status(400).json({
        message:
          "El nombre completo ingresado no coincide con el usuario autenticado.",
      });
    }

    // 3. Validación de Email
    if (internalUser.correo !== email) {
      return res.status(400).json({
        message: "El email ingresado no coincide con el usuario autenticado.",
      });
    }

    // 4. Verificación de duplicados PENDIENTES
    const existing = await AccountRequest.findOne({
      where: {
        user_id: internalUser.id,
        tipo,
        status: "PENDIENTE",
      },
    });

    if (existing) {
      return res.status(400).json({
        message: "Ya tienes una solicitud pendiente de este tipo.",
      });
    }

    // 5. Creación guardando el Nombre Completo (Nombre + Apellido)
    const request = await AccountRequest.create({
      user_id: internalUser.id,
      tipo,
      dpi,
      fullName,
      phone,
      email,
    });

    res.status(201).json({
      message: "Solicitud enviada correctamente.",
      request,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMyRequests = async (req, res) => {
  try {
    const internalUser = await getInternalUser(
      req.user.auth_id,
      req.user.email,
    );

    const requests = await AccountRequest.findAll({
      where: { user_id: internalUser.id },
      order: [["createdAt", "DESC"]],
    });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
