import { Router } from "express";
import { getMyAccounts } from "./account.controller.js";

export const accountRouter = Router();
accountRouter.get("/", getMyAccounts);
