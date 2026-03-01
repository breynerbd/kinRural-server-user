import { Router } from "express";
import { createAccountRequest, getMyRequests } from "./accountRequest.controller.js";

export const accountRequestRouter = Router();

accountRequestRouter.get("/", getMyRequests);
accountRequestRouter.post("/", createAccountRequest);