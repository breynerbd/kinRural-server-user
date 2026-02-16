// src/users/user.router.js
import { Router } from "express";
import { getUserProfile, updateUser } from "./user.controller.js";

export const userRouter = Router();

userRouter.get("/", getUserProfile); // GET /user
userRouter.put("/", updateUser);
