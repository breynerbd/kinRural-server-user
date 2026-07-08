import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import { corsOptions } from "./cors-configuration.js";
import { helmetConfiguration } from "./helmet-configuration.js";
import { requestLimit } from "../middlewares/request-limit.js";
import { errorHandler } from "../middlewares/handle-errors.js";

import { accountRouter } from "../src/accounts/account.router.js";
import { transactionRouter } from "../src/transactions/transaction.router.js";
import { movementRouter } from "../src/movements/movement.router.js";
import { userRouter } from "../src/users/user.router.js";
import { loanRouter } from "../src/loans/loan.router.js";
import { cardRouter } from "../src/cards/card.router.js";
import { accountRequestRouter } from "../src/accountRequest/accountRequest.router.js";
import { beneficiaryRouter } from "../src/beneficiaries/beneficiary.router.js";
import { statementRouter } from "../src/statements/statement.router.js";
import { exchangeRouter } from "../src/exchange/exchange.router.js";

dotenv.config();

export const initServerUser = () => {
  const app = express();
  const BASE_URL = "/kinrural/v1/user";

  app.use(express.json());
  app.use(cors(corsOptions));
  app.use(helmet(helmetConfiguration));
  app.use(express.urlencoded({ extended: false }));
  app.use(morgan("dev"));
  app.use(requestLimit);

  app.use(`${BASE_URL}/accounts`, accountRouter);
  app.use(`${BASE_URL}/transactions`, transactionRouter);
  app.use(`${BASE_URL}/movements`, movementRouter);
  app.use(`${BASE_URL}/users`, userRouter);
  app.use(`${BASE_URL}/loans`, loanRouter);
  app.use(`${BASE_URL}/cards`, cardRouter);
  app.use(`${BASE_URL}/account-requests`, accountRequestRouter);
  app.use(`${BASE_URL}/beneficiaries`, beneficiaryRouter);
  app.use(`${BASE_URL}/statements`, statementRouter);
  app.use(`${BASE_URL}/exchange`, exchangeRouter);

  app.get("/health", (req, res) => {
    res.status(200).json({
      success: true,
      message: "Kinrural User API running correctly",
    });
  });

  app.use(errorHandler);

  return app;
};
