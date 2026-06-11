import { User } from "./user.model.js";
import { getInternalUser } from "../utils/getInternalUser.js";

export const getUserProfile = async (req, res, next) => {
  try {
    const internalUser = await getInternalUser(
      req.user.auth_id,
      req.user.email,
    );

    if (!internalUser)
      return res
        .status(404)
        .json({ success: false, message: "Perfil no encontrado" });

    res.status(200).json({ success: true, user: internalUser });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    // =========================
    // BUSCAR USUARIO INTERNO
    // =========================
    let internalUser = await getInternalUser(req.user.auth_id);

    // =========================
    // CAMPOS PERMITIDOS
    // =========================
    const allowedFields = [
      "nombre",
      "apellido",
      "dpi",
      "correo",
      "telefono",
      "direccion",
      "ingresos_mensuales",
    ];

    const updates = {};

    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    // =========================
    // CREAR PERFIL SI NO EXISTE
    // =========================
    if (!internalUser) {
      internalUser = await User.create({
        auth_id: req.user.auth_id,
        role: "USER",
        ...updates,
      });

      return res.status(201).json({
        success: true,
        message: "Perfil creado correctamente",
        user: internalUser,
      });
    }

    // =========================
    // ACTUALIZAR PERFIL
    // =========================
    await internalUser.update(updates);

    return res.status(200).json({
      success: true,
      message: "Perfil actualizado correctamente",
      user: internalUser,
    });
  } catch (error) {
    next(error);
  }
};
