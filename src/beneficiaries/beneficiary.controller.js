import { Beneficiary } from "./beneficiary.model.js";
import { Account } from "../../../kinRural-server-admin/src/accounts/account.model.js";

export const createBeneficiary = async (req, res, next) => {
    try {
        const { account_id, alias } = req.body;

        // 1️⃣ Validar que exista la cuenta destino
        const cuentaDestino = await Account.findByPk(account_id);
        if (!cuentaDestino) {
            return res.status(404).json({
                success: false,
                message: "Cuenta destino no existe"
            });
        }

        // 2️⃣ No permitir agregarse a sí mismo
        if (cuentaDestino.user_id === req.user.id) {
            return res.status(400).json({
                success: false,
                message: "No puede agregarse a sí mismo como beneficiario"
            });
        }

        // 3️⃣ Verificar que no exista ya ese beneficiario para este usuario
        const existing = await Beneficiary.findOne({
            where: {
                account_id,
                user_id: req.user.id
            }
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Beneficiario ya registrado"
            });
        }

        // 4️⃣ Crear beneficiario
        const beneficiary = await Beneficiary.create({
            account_id,
            alias,
            user_id: req.user.id   // 👈 dueño del beneficiario
        });

        return res.status(201).json({
            success: true,
            beneficiary
        });

    } catch (error) {
        next(error);
    }
};

export const getMyBeneficiaries = async (req, res, next) => {
    try {
        const beneficiaries = await Beneficiary.findAll({
            where: { user_id: req.user.id }
        });

        res.status(200).json({ success: true, beneficiaries });
    } catch (error) {
        next(error);
    }
};

export const deleteBeneficiary = async (req, res, next) => {
    try {
        const { id } = req.params;

        const beneficiary = await Beneficiary.findOne({
            where: { id, user_id: req.user.id }
        });

        if (!beneficiary)
            return res.status(404).json({ success: false, message: "Beneficiario no encontrado" });

        await beneficiary.destroy();

        res.status(200).json({ success: true, message: "Beneficiario eliminado correctamente" });

    } catch (error) {
        next(error);
    }
};

export const updateBeneficiary = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { alias } = req.body;

        const beneficiary = await Beneficiary.findOne({
            where: { id, user_id: req.user.id }
        });

        if (!beneficiary)
            return res.status(404).json({ success: false, message: "Beneficiario no encontrado" });

        beneficiary.alias = alias;
        await beneficiary.save();

        res.status(200).json({ success: true, beneficiary });

    } catch (error) {
        next(error);
    }
};
