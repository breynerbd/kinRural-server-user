import { Router } from "express";
import { createTransaction } from "./transaction.controller.js";
import { authenticateUser } from "../../middlewares/authenticateUser.js";

export const transactionRouter = Router();
transactionRouter.post("/", authenticateUser, createTransaction);
