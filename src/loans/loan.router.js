import { Router } from "express";
import { quoteLoan, requestLoan, getMyLoans } from "./loan.controller.js";
import { authenticateUser } from "../../middlewares/authenticateUser.js";

export const loanRouter = Router();

loanRouter.get(
  "/",
  authenticateUser,
  getMyLoans
);

loanRouter.post(
  "/quote",
  authenticateUser,
  quoteLoan
);

loanRouter.post(
  "/request",
  authenticateUser,
  requestLoan
);