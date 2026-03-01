/* =========================
   COTIZAR PRÉSTAMO
========================= */
export const validateQuoteLoan = [
  body("monto")
    .isFloat({ min: 0.01 })
    .withMessage("Monto inválido"),

  body("tasa_interes")
    .isFloat({ min: 0.01 })
    .withMessage("Tasa inválida"),

  body("plazo_meses")
    .isInt({ min: 6, max: 72 })
    .withMessage("El plazo debe estar entre 6 y 72 meses"),
];

/* =========================
   SOLICITAR PRÉSTAMO
========================= */
export const validateRequestLoan = [
  body("monto")
    .isFloat({ min: 0.01 })
    .withMessage("Monto inválido"),

  body("tasa_interes")
    .isFloat({ min: 0.01 })
    .withMessage("Tasa inválida"),

  body("plazo_meses")
    .isInt({ min: 6, max: 72 })
    .withMessage("El plazo debe estar entre 6 y 72 meses"),

  body("tipo_tasa")
    .isIn(["FIJA", "VARIABLE"])
    .withMessage("Tipo de tasa inválido"),

  body("account_id")
    .isInt()
    .withMessage("ID de cuenta inválido"),

  body("meses_recalculo")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Meses de recalculo inválido"),
];