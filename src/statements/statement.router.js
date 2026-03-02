import { Router } from "express";
import { getMyStatements } from "./statement.controller.js";

export const statementRouter = Router();

statementRouter.get("/", getMyStatements);