import { Router } from "express";
import { requestCard, getMyCards } from "./card.controller.js";
import { authenticateUser } from "../../middlewares/authenticateUser.js";

export const cardRouter = Router();

cardRouter.post("/", authenticateUser, requestCard);
cardRouter.get("/", authenticateUser, getMyCards);
