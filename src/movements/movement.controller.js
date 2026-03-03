import { Transaction } from "../transactions/transaction.model.js";
import { Account } from "../accounts/account.model.js";

export const getMyTransactions = async (req, res, next) => {
    try {
        // Primero obtenemos las cuentas del usuario
        const accounts = await Account.findAll({
            where: { user_id: req.user.id },
            attributes: ["id"]
        });
        const accountIds = accounts.map(a => a.id);

        // Ahora obtenemos las transacciones donde el usuario es origen o destino
        const transactions = await Transaction.findAll({
            where: {
                cuenta_origen_id: accountIds.length ? accountIds : null
            }
        });

        res.status(200).json({ success: true, transactions });
    } catch (error) {
        next(error);
    }
};
