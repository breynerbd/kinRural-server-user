import { Router } from "express";
import { getMyTransactions } from "./movement.controller.js";

export const movementRouter = Router();
movementRouter.get("/", getMyTransactions);
