import { db } from "../../configs/db.js";
import { Transaction } from "../../../kinRural-server-admin/src/transactions/transaction.model.js";
import { Account } from "../../../kinRural-server-admin/src/accounts/account.model.js";
import { Movement } from "../../../kinRural-server-admin/src/movements/movement.model.js";


export const createTransaction = async (req, res) => {
    const t = await db.transaction();
    try {
        const { tipo, monto, cuenta_destino_id } = req.body;

        const cuentaOrigen = await Account.findOne({
            where: { user_id: req.user.id }
        });
        if (!cuentaOrigen) throw new Error("Cuenta origen no encontrada para este usuario");

        if (tipo === "RETIRO" && parseFloat(cuentaOrigen.saldo) < monto) {
            throw new Error("Saldo insuficiente para retiro");
        }
        let cuentaDestino = null;
        if (tipo === "TRANSFERENCIA") {
            if (!cuenta_destino_id) throw new Error("Debe indicar la cuenta de destino");
            cuentaDestino = await Account.findByPk(cuenta_destino_id);
            if (!cuentaDestino) throw new Error("Cuenta de destino no encontrada");
            if (parseFloat(cuentaOrigen.saldo) < monto) throw new Error("Saldo insuficiente para transferencia");
        }

        const transaction = await Transaction.create({
            tipo,
            monto,
            cuenta_origen_id: cuentaOrigen.id,
            cuenta_destino_id: cuentaDestino ? cuentaDestino.id : null
        }, { transaction: t });

        if (tipo === "DEPOSITO") cuentaOrigen.saldo = parseFloat(cuentaOrigen.saldo) + parseFloat(monto);
        if (tipo === "RETIRO") cuentaOrigen.saldo = parseFloat(cuentaOrigen.saldo) - parseFloat(monto);
        if (tipo === "TRANSFERENCIA") {
            cuentaOrigen.saldo = parseFloat(cuentaOrigen.saldo) - parseFloat(monto);
            cuentaDestino.saldo = parseFloat(cuentaDestino.saldo) + parseFloat(monto);
            await cuentaDestino.save({ transaction: t });
        }
        await cuentaOrigen.save({ transaction: t });

        await Movement.create({
            tipo_operacion: tipo,
            tipo_movimiento: tipo === "DEPOSITO" ? "CREDITO" : "DEBITO",
            monto,
            transaction_id: transaction.id,
            account_id: cuentaOrigen.id
        }, { transaction: t });

        if (tipo === "TRANSFERENCIA") {
            await Movement.create({
                tipo_operacion: "TRANSFERENCIA",
                tipo_movimiento: "CREDITO",
                monto,
                transaction_id: transaction.id,
                account_id: cuentaDestino.id
            }, { transaction: t });
        }

        await t.commit();
        res.status(200).json({ success: true, transaction });

    } catch (error) {
        await t.rollback();
        res.status(400).json({ success: false, message: error.message });
    }
};

