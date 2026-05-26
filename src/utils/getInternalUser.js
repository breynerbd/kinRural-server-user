import { User } from "../users/user.model.js";

export const getInternalUser = async (authId) => {
  try {
    if (!authId) {
      throw new Error("authId no puede ser undefined");
    }

    const user = await User.findOne({
      where: {
        auth_id: authId,
      },
    });

    return user;
  } catch (error) {
    throw error;
  }
};
