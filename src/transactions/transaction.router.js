import { Router } from "express";
import { createTransaction } from "./transaction.controller.js";
import { onlyUser } from "../../middlewares/onlyUser.js";

export const transactionRouter = Router();
transactionRouter.post("/", onlyUser, createTransaction);
