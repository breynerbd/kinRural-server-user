// movement.controller.js — versión corregida
import { Transaction } from "../transactions/transaction.model.js";
import { Account } from "../accounts/account.model.js";
import { Movement } from "../movements/movement.model.js"; // ← AÑADIR
import { getInternalUser } from "../utils/getInternalUser.js"; // ← FALTABA ESTE
import { Op } from "sequelize"; // ← AÑADIR

export const getMyTransactions = async (req, res, next) => {
  try {
    const internalUser = await getInternalUser(
      req.user.auth_id,
      req.user.email,
    );

    const accounts = await Account.findAll({
      where: { user_id: internalUser.id },
      attributes: ["id"],
    });

    const accountIds = accounts.map((a) => a.id);

    if (!accountIds.length) {
      return res.status(200).json({ success: true, transactions: [] });
    }

    const movements = await Movement.findAll({
      where: {
        account_id: { [Op.in]: accountIds },
      },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ success: true, transactions: movements });
  } catch (error) {
    next(error);
  }
};
