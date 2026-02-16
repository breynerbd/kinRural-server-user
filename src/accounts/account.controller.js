import { Account } from "../../../kinRural-server-admin/src/accounts/account.model.js";

export const getMyAccounts = async (req, res, next) => {
    try {
        const accounts = await Account.findAll({ where: { user_id: req.user.id } });
        res.status(200).json({ success: true, accounts });
    } catch (error) {
        next(error);
    }
};
