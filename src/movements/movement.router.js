import { Router } from "express";
import { getMyTransactions } from "./movement.controller.js";
import { onlyUser } from "../../middlewares/onlyUser.js";

export const movementRouter = Router();
movementRouter.get("/", onlyUser, getMyTransactions);
