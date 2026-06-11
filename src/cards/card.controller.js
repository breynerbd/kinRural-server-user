import { Card } from "./card.model.js";
import { Account } from "../accounts/account.model.js";
import {
  generateCardNumber,
  generateCVV,
  generateExpirationDate,
} from "./cardGenerator.js";
import { getInternalUser } from "../utils/getInternalUser.js";

export const requestCard = async (req, res) => {
  try {
    const { account_id, tipo } = req.body;

    const internalUser = await getInternalUser(
      req.user.auth_id,
      req.user.email,
    );

    const account = await Account.findOne({
      where: { id: account_id, user_id: internalUser.id },
    });

    if (!account)
      return res.status(404).json({ message: "Cuenta no encontrada" });

    if (account.estado === "BLOQUEADA")
      return res.status(400).json({ message: "Cuenta bloqueada" });

    if (tipo === "DEBITO") {
      const existingDebitCard = await Card.findOne({
        where: {
          account_id,
          tipo: "DEBITO",
          estado: ["APROBADA", "ACTIVA"],
        },
      });

      if (existingDebitCard) {
        return res.status(400).json({
          message: "Esta cuenta ya tiene una tarjeta de débito activa",
        });
      }
    }

    if (tipo === "CREDITO") {
      const pendingCreditCard = await Card.findOne({
        where: {
          account_id,
          tipo: "CREDITO",
          estado: "PENDIENTE",
        },
      });

      if (pendingCreditCard) {
        return res.status(400).json({
          message: "Ya tienes una solicitud de tarjeta de crédito pendiente.",
        });
      }

      const activeCreditCardsCount = await Card.count({
        where: {
          account_id,
          tipo: "CREDITO",
          estado: ["APROBADA", "ACTIVA"],
        },
      });

      if (activeCreditCardsCount >= 1) {
        return res.status(400).json({
          message:
            "Has alcanzado el límite máximo de 1 tarjeta de crédito para esta cuenta.",
        });
      }
    }

    const card = await Card.create({
      account_id,
      tipo,
      numero_tarjeta: generateCardNumber(),
      cvv: generateCVV(),
      fecha_expiracion: generateExpirationDate(),
      limite_credito: tipo === "CREDITO" ? 5000 : null,
      estado: "PENDIENTE",
    });

    res.status(201).json({
      success: true,
      message: "Tarjeta solicitada. Pendiente aprobación.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyCards = async (req, res) => {
  try {
    const internalUser = await getInternalUser(
      req.user.auth_id,
      req.user.email,
    );

    const cards = await Card.findAll({
      include: {
        model: Account,
        where: { user_id: internalUser.id },
      },
    });

    const safeCards = cards.map((card) => ({
      id: card.id,
      account_id: card.account_id,
      tipo: card.tipo,
      numero_tarjeta: "**** **** **** " + card.numero_tarjeta.slice(-4),
      fecha_expiracion: card.fecha_expiracion,
      estado: card.estado,
    }));

    res.status(200).json({ success: true, cards: safeCards });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
