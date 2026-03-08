import { Router } from "express";
import { getMyTransactions } from "./movement.controller.js";
import { authenticateUser } from "../../middlewares/authenticateUser.js";

export const movementRouter = Router();
movementRouter.get("/", authenticateUser, getMyTransactions);
