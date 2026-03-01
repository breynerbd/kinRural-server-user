import { Router } from "express";
import { requestCard, getMyCards } from "./card.controller.js";

export const cardRouter = Router();

cardRouter.post("/", requestCard);
cardRouter.get("/", getMyCards);
