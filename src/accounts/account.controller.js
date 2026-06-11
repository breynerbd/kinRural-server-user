import { Account } from "./account.model.js";
import { getInternalUser } from "../utils/getInternalUser.js";

export const getMyAccounts = async (req, res, next) => {
  try {
    const internalUser = await getInternalUser(
      req.user.auth_id,
      req.user.email,
    );

    const accounts = await Account.findAll({
      where: { user_id: internalUser.id },
    });

    res.status(200).json({ success: true, accounts });
  } catch (error) {
    next(error);
  }
};
