import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { corsOptions } from "./cors-configuration.js";
import { helmetConfiguration } from "./helmet-configuration.js";
import { requestLimit } from "../middlewares/request-limit.js";

import { accountRouter } from "../src/accounts/account.router.js";
import { transactionRouter } from "../src/transactions/transaction.router.js";
import { movementRouter } from "../src/movements/movement.router.js";
import { errorHandler } from "../middlewares/handle-errors.js";
import { userRouter } from "../src/users/user.router.js";
import { loanRouter } from "../src/loans/loan.router.js";
import { cardRouter } from "../src/cards/card.router.js";
import { accountRequestRouter } from "../src/accountRequest/accountRequest.router.js";

export const initServerUser = () => {
    const app = express();
    app.use(express.json());
    app.use(cors(corsOptions));
    app.use(helmet(helmetConfiguration));
    app.use(express.urlencoded({ extended: false }));
    app.use(morgan("dev"));
    app.use(requestLimit);

    app.use("/accounts", accountRouter);
    app.use("/transactions", transactionRouter);
    app.use("/movements", movementRouter);
    app.use("/users", userRouter);
    app.use("/loans", loanRouter);
    app.use("/cards", cardRouter);
    app.use("/account-requests", accountRequestRouter);

    app.get("/health", (req, res) => {
        res.status(200).json({
            success: true,
            message: "Kinrural User API running correctly"
        });
    });

    app.use(errorHandler);

    return app;
};
