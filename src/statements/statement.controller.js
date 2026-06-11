import { Statement } from "./statement.model.js";
import { Account } from "../accounts/account.model.js";
import { getInternalUser } from "../utils/getInternalUser.js";

export const getMyStatements = async (req, res, next) => {
  try {
    const internalUser = await getInternalUser(
      req.user.auth_id,
      req.user.email,
    );

    const accounts = await Account.findAll({
      where: { user_id: internalUser.id },
      attributes: ["id"],
    });

    const accountIds = accounts.map((acc) => acc.id);

    const statements = await Statement.findAll({
      where: { account_id: accountIds },
      order: [
        ["anio", "DESC"],
        ["mes", "DESC"],
      ],
    });

    res.status(200).json({
      success: true,
      statements,
    });
  } catch (error) {
    next(error);
  }
};
