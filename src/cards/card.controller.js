import { Card } from "../../../kinRural-server-admin/src/cards/card.model.js";
import { Account } from "../../../kinRural-server-admin/src/accounts/account.model.js";
import {
    generateCardNumber,
    generateCVV,
    generateExpirationDate
} from "../../../kinRural-server-admin/src/cards/cardGenerator.js";

export const requestCard = async (req, res) => {
    try {
        const { account_id, tipo } = req.body;

        const account = await Account.findOne({
            where: { id: account_id, user_id: req.user.id }
        });

        if (!account)
            return res.status(404).json({ message: "Cuenta no encontrada" });

        if (account.estado === "BLOQUEADA")
            return res.status(400).json({ message: "Cuenta bloqueada" });

        // 🔹 VALIDACIÓN: solo una tarjeta de débito activa por cuenta
        if (tipo === "DEBITO") {
            const existingDebitCard = await Card.findOne({
                where: {
                    account_id,
                    tipo: "DEBITO",
                    estado: ["APROBADA", "ACTIVA"] // ajusta según tus estados reales
                }
            });

            if (existingDebitCard) {
                return res.status(400).json({
                    message: "Esta cuenta ya tiene una tarjeta de débito activa"
                });
            }
        }

        // 🔹 VALIDACIÓN PARA TARJETAS DE CRÉDITO
        if (tipo === "CREDITO") {

            // 1️⃣ Verificar si ya tiene una solicitud pendiente
            const pendingCreditCard = await Card.findOne({
                where: {
                    account_id,
                    tipo: "CREDITO",
                    estado: "PENDIENTE"
                }
            });

            if (pendingCreditCard) {
                return res.status(400).json({
                    message: "Ya tienes una solicitud de tarjeta de crédito pendiente."
                });
            }

            // 2️⃣ Contar tarjetas activas/aprobadas
            const activeCreditCardsCount = await Card.count({
                where: {
                    account_id,
                    tipo: "CREDITO",
                    estado: ["APROBADA", "ACTIVA"]
                }
            });

            if (activeCreditCardsCount >= 1) {
                return res.status(400).json({
                    message: "Has alcanzado el límite máximo de 1 tarjeta de crédito para esta cuenta."
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
            estado: "PENDIENTE"
        });

        res.status(201).json({
            success: true,
            message: "Tarjeta solicitada. Pendiente aprobación."
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMyCards = async (req, res) => {
    const cards = await Card.findAll({
        include: {
            model: Account,
            where: { user_id: req.user.id }
        }
    });

    const safeCards = cards.map(card => ({
        id: card.id,
        account_id: card.account_id,
        tipo: card.tipo,
        numero_tarjeta: "**** **** **** " + card.numero_tarjeta.slice(-4),
        fecha_expiracion: card.fecha_expiracion,
        estado: card.estado
    }));

    res.json({ success: true, cards: safeCards });
};