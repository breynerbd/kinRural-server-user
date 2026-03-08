import { Router } from "express";
import { getMyStatements } from "./statement.controller.js";
import { authenticateUser } from "../../middlewares/authenticateUser.js";

export const statementRouter = Router();

statementRouter.get("/", authenticateUser, getMyStatements);