import { Router } from "express";
import { createAccountRequest, getMyRequests } from "./accountRequest.controller.js";
import { onlyUser } from "../../middlewares/onlyUser.js";

export const accountRequestRouter = Router();

accountRequestRouter.get("/", onlyUser, getMyRequests);
accountRequestRouter.post("/", onlyUser, createAccountRequest);