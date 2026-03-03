import { Router } from "express";
import { requestCard, getMyCards } from "./card.controller.js";
import { onlyUser } from "../../middlewares/onlyUser.js";

export const cardRouter = Router();

cardRouter.post("/", onlyUser, requestCard);
cardRouter.get("/", onlyUser, getMyCards);
