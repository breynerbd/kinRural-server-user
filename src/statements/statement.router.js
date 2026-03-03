import { Router } from "express";
import { getMyStatements } from "./statement.controller.js";
import { onlyUser } from "../../middlewares/onlyUser.js";

export const statementRouter = Router();

statementRouter.get("/", onlyUser, getMyStatements);