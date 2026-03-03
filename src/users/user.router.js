// src/users/user.router.js
import { Router } from "express";
import { getUserProfile, updateUser } from "./user.controller.js";
import { onlyUser } from "../../middlewares/onlyUser.js";

export const userRouter = Router();

userRouter.get("/", onlyUser, getUserProfile); // GET /user
userRouter.put("/", onlyUser, updateUser);
