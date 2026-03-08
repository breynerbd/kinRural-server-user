import { Router } from "express";
import { getMyAccounts } from "./account.controller.js";
import { authenticateUser } from "../../middlewares/authenticateUser.js";

export const accountRouter = Router();
accountRouter.get("/", authenticateUser, getMyAccounts);
