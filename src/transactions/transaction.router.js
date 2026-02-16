import { Router } from "express";
import { createTransaction } from "./transaction.controller.js";

export const transactionRouter = Router();
transactionRouter.post("/", createTransaction);
