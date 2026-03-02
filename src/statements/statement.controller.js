import { Statement } from "../../../kinRural-server-admin/src/statements/statement.model.js";
import { Account } from "../../../kinRural-server-admin/src/accounts/account.model.js";

export const getMyStatements = async (req, res) => {
    try {
        const accounts = await Account.findAll({
            where: { user_id: req.user.id },
            attributes: ['id']
        });

        const accountIds = accounts.map(acc => acc.id);

        const statements = await Statement.findAll({
            where: { account_id: accountIds },
            order: [['anio', 'DESC'], ['mes', 'DESC']]
        });

        res.status(200).json({ success: true, statements });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};