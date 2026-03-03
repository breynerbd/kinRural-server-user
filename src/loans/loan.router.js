import { Router } from "express";
import { quoteLoan, requestLoan, getMyLoans } from "./loan.controller.js";
import { onlyUser } from "../../middlewares/onlyUser.js";

export const loanRouter = Router();

loanRouter.get(
  "/user/:user_id",
  onlyUser,
  getMyLoans
);

loanRouter.post(
  "/quote",
  onlyUser,
  quoteLoan
);

loanRouter.post(
  "/request",
  onlyUser,
  requestLoan
);