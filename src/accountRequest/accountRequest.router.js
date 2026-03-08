import { Router } from "express";
import { createAccountRequest, getMyRequests } from "./accountRequest.controller.js";
import { authenticateUser } from "../../middlewares/authenticateUser.js";

export const accountRequestRouter = Router();

accountRequestRouter.get("/", authenticateUser, getMyRequests);
accountRequestRouter.post("/", authenticateUser, createAccountRequest);