import { Beneficiary } from "./beneficiary.model.js";
import { Account } from "../accounts/account.model.js";
import { getInternalUser } from "../utils/getInternalUser.js";

export const createBeneficiary = async (req, res, next) => {
  try {
    const { account_id, alias } = req.body;

    const cuentaDestino = await Account.findByPk(account_id);
    if (!cuentaDestino) {
      return res.status(404).json({
        success: false,
        message: "Cuenta destino no existe",
      });
    }

    const internalUser = await getInternalUser(req.user.id, req.user.email);

    if (cuentaDestino.user_id === internalUser.id) {
      return res.status(400).json({
        success: false,
        message: "No puede agregarse a sí mismo como beneficiario",
      });
    }

    const existing = await Beneficiary.findOne({
      where: {
        account_id,
        user_id: internalUser.id,
      },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Beneficiario ya registrado",
      });
    }

    const beneficiary = await Beneficiary.create({
      account_id,
      alias,
      user_id: internalUser.id,
    });

    return res.status(201).json({
      success: true,
      beneficiary,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyBeneficiaries = async (req, res, next) => {
  try {
    const internalUser = await getInternalUser(req.user.id, req.user.email);
    console.log("REQ USER:", req.user);
    console.log("INTERNAL USER:", internalUser);

    const beneficiaries = await Beneficiary.findAll({
      where: { user_id: internalUser.id },
    });

    res.status(200).json({ success: true, beneficiaries });
  } catch (error) {
    next(error);
  }
};

export const deleteBeneficiary = async (req, res, next) => {
  try {
    const { id } = req.params;

    const internalUser = await getInternalUser(req.user.id, req.user.email);

    const beneficiary = await Beneficiary.findOne({
      where: { id, user_id: internalUser.id },
    });

    if (!beneficiary)
      return res
        .status(404)
        .json({ success: false, message: "Beneficiario no encontrado" });

    await beneficiary.destroy();

    res
      .status(200)
      .json({ success: true, message: "Beneficiario eliminado correctamente" });
  } catch (error) {
    next(error);
  }
};

export const updateBeneficiary = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { alias } = req.body;

    const internalUser = await getInternalUser(req.user.id, req.user.email);

    const beneficiary = await Beneficiary.findOne({
      where: { id, user_id: internalUser.id },
    });

    if (!beneficiary)
      return res
        .status(404)
        .json({ success: false, message: "Beneficiario no encontrado" });

    beneficiary.alias = alias;
    await beneficiary.save();

    res.status(200).json({ success: true, beneficiary });
  } catch (error) {
    next(error);
  }
};
