import { db } from "../../configs/db.js";
import { Transaction } from "./transaction.model.js";
import { Account } from "../accounts/account.model.js";
import { Movement } from "../movements/movement.model.js";
import { Beneficiary } from "../beneficiaries/beneficiary.model.js";
import { getInternalUser } from "../utils/getInternalUser.js";

export const createTransaction = async (req, res) => {
  const t = await db.transaction();

  try {
    const { tipo, monto, alias, cuenta_destino_id } = req.body;

    let cuentaDestino = null;

    const internalUser = await getInternalUser(
      req.user.auth_id,
      req.user.email,
    );

    const cuentaOrigen = await Account.findOne({
      where: { user_id: internalUser.id },
    });

    if (!cuentaOrigen)
      throw new Error("Cuenta origen no encontrada para este usuario");

    if (tipo === "RETIRO" && parseFloat(cuentaOrigen.saldo) < monto)
      throw new Error("Saldo insuficiente para retiro");

    if (tipo === "TRANSFERENCIA") {
      if (cuenta_destino_id === cuentaOrigen.id)
        throw new Error("No se puede transferir a la misma cuenta");

      if (alias) {
        const beneficiary = await Beneficiary.findOne({
          where: {
            alias,
            user_id: internalUser.id,
          },
        });

        if (!beneficiary) throw new Error("Beneficiario no encontrado");

        cuentaDestino = await Account.findByPk(beneficiary.account_id);

        if (!cuentaDestino) throw new Error("Cuenta destino no encontrada");
      } else if (cuenta_destino_id) {
        cuentaDestino = await Account.findByPk(cuenta_destino_id);

        if (!cuentaDestino) throw new Error("Cuenta destino no encontrada");
      } else {
        throw new Error("Debe indicar alias o cuenta_destino_id");
      }

      if (parseFloat(cuentaOrigen.saldo) < monto)
        throw new Error("Saldo insuficiente para transferencia");
    }

    const transaction = await Transaction.create(
      {
        tipo,
        monto,
        cuenta_origen_id: cuentaOrigen.id,
        cuenta_destino_id: cuentaDestino ? cuentaDestino.id : null,
      },
      { transaction: t },
    );

    if (tipo === "DEPOSITO")
      cuentaOrigen.saldo = parseFloat(cuentaOrigen.saldo) + parseFloat(monto);

    if (tipo === "RETIRO")
      cuentaOrigen.saldo = parseFloat(cuentaOrigen.saldo) - parseFloat(monto);

    if (tipo === "TRANSFERENCIA") {
      cuentaOrigen.saldo = parseFloat(cuentaOrigen.saldo) - parseFloat(monto);
      cuentaDestino.saldo = parseFloat(cuentaDestino.saldo) + parseFloat(monto);
      await cuentaDestino.save({ transaction: t });
    }

    await cuentaOrigen.save({ transaction: t });

    // Definimos la lógica dinámica para el movimiento de origen
    const esEgreso = ["RETIRO", "TRANSFERENCIA"].includes(tipo);

    await Movement.create(
      {
        tipo_operacion: tipo,
        tipo_movimiento: esEgreso ? "DEBITO" : "CREDITO",
        monto,
        transaction_id: transaction.id,
        account_id: cuentaOrigen.id,
      },
      { transaction: t },
    );

    if (tipo === "TRANSFERENCIA") {
      await Movement.create(
        {
          tipo_operacion: "TRANSFERENCIA",
          tipo_movimiento: "CREDITO", // ← El destino SIEMPRE recibe (CREDITO)
          monto,
          transaction_id: transaction.id,
          account_id: cuentaDestino.id,
        },
        { transaction: t },
      );
    }

    await t.commit();

    res.status(200).json({
      success: true,
      transaction,
    });
  } catch (error) {
    await t.rollback();
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
