import { Loan, LoanInstallment } from "./loan.model.js";
import { User } from "../users/user.model.js";
import { getInternalUser } from "../utils/getInternalUser.js";

const calcularCuota = (monto, tasaAnual, meses) => {
    const tasaMensual = (tasaAnual / 100) / 12;
    const cuota = monto * (tasaMensual * Math.pow(1 + tasaMensual, meses)) /
        (Math.pow(1 + tasaMensual, meses) - 1);
    return parseFloat(cuota.toFixed(2));
};

export const quoteLoan = async (req, res) => {
    const { monto, tasa_interes, plazo_meses } = req.body;

    const cuota = calcularCuota(monto, tasa_interes, plazo_meses);

    res.json({
        success: true,
        cuota,
        total_pagar: (cuota * plazo_meses).toFixed(2)
    });
};

export const requestLoan = async (req, res) => {
    try {
        const internalUser = await getInternalUser(req.user.id, req.user.email);

        if (!internalUser)
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });

        const {
            monto,
            tasa_interes,
            plazo_meses,
            tipo_tasa,
            meses_recalculo,
            account_id
        } = req.body;

        const user = await User.findByPk(internalUser.id);

        if (!user)
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });

        const cuota = calcularCuota(monto, tasa_interes, plazo_meses);

        const prestamosActivos = await Loan.findAll({
            where: { user_id: internalUser.id, estado: "ACTIVE" }
        });

        const sumaCuotas = prestamosActivos.reduce(
            (acc, l) => acc + parseFloat(l.cuota_mensual || 0), 0
        );

        if (sumaCuotas + cuota > user.ingresos_mensuales * 0.40)
            return res.status(400).json({
                success: false,
                message: "Supera capacidad de endeudamiento"
            });

        // ------------------------------
        // Redondear saldo pendiente
        let saldoPendiente = monto;
        saldoPendiente = parseFloat(saldoPendiente.toFixed(2));
        if (saldoPendiente < 0.01) saldoPendiente = 0;
        // ------------------------------

        const loan = await Loan.create({
            user_id: internalUser.id,
            account_id,
            monto,
            tasa_interes,
            tipo_tasa,
            plazo_meses,
            meses_recalculo,
            cuota_mensual: cuota,
            saldo_pendiente: saldoPendiente,
            estado: "PENDING"
        });

        res.status(201).json({ success: true, loan });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getMyLoans = async (req, res) => {
    try {

        const internalUser = await getInternalUser(req.user.id, req.user.email);

        if (!internalUser)
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });

        const loans = await Loan.findAll({
            where: { user_id: internalUser.id },
            include: [{
                model: LoanInstallment
            }],
            order: [["createdAt", "DESC"]]
        });

        const response = loans.map(loan => {

            const cuotasPagadas = loan.loan_installments
                .filter(i => i.estado === "PAGADA").length;

            const cuotasPendientes = loan.loan_installments
                .filter(i => i.estado !== "PAGADA").length;

            return {
                id: loan.id,
                monto: loan.monto,
                estado: loan.estado,
                saldo_pendiente: loan.saldo_pendiente,
                cuota_mensual: loan.cuota_mensual,
                plazo_meses: loan.plazo_meses,
                cuotas_pagadas: cuotasPagadas,
                cuotas_pendientes: cuotasPendientes
            };
        });

        res.json({
            success: true,
            loans: response
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
