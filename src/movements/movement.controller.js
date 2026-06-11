import { Transaction } from "../transactions/transaction.model.js";
import { Account } from "../accounts/account.model.js";
import { getInternalUser } from "../utils/getInternalUser.js";

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
      return res.status(200).json({
        success: true,
        transactions: [],
      });
    }

    const transactions = await Transaction.findAll({
      where: {
        cuenta_origen_id: accountIds,
      },
    });

    res.status(200).json({
      success: true,
      transactions,
    });
  } catch (error) {
    next(error);
  }
};
