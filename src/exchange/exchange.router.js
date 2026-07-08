// src/exchange/exchange.router.js
import { Router } from "express";
import {
  convertCurrency,
  getCurrencies,
  getAccountBalanceConverted,
} from "./exchange.controller.js";
import { authenticateUser } from "../../middlewares/authenticateUser.js";

export const exchangeRouter = Router();

exchangeRouter.get("/convert", authenticateUser, convertCurrency);
exchangeRouter.get("/currencies", authenticateUser, getCurrencies);
exchangeRouter.get(
  "/balance-converted",
  authenticateUser,
  getAccountBalanceConverted,
);
