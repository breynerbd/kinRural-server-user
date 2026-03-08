import { Router } from "express";
import { getUserProfile, updateUser } from "./user.controller.js";
import { authenticateUser } from "../../middlewares/authenticateUser.js";

export const userRouter = Router();

userRouter.get("/", authenticateUser, getUserProfile);
userRouter.put("/", authenticateUser, updateUser);
