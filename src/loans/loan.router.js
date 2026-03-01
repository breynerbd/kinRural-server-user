import { Router } from "express";
import { quoteLoan, requestLoan, getMyLoans } from "./loan.controller.js";

export const loanRouter = Router();

loanRouter.get(
  "/user/:user_id",
  getMyLoans
);

loanRouter.post(
  "/quote",
  quoteLoan
);

loanRouter.post(
  "/request",
  requestLoan
);