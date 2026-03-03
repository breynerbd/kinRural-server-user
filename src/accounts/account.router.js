import { Router } from "express";
import { getMyAccounts } from "./account.controller.js";
import { onlyUser } from "../../middlewares/onlyUser.js";

export const accountRouter = Router();
accountRouter.get("/", onlyUser, getMyAccounts);
