import { Router } from "express";
import {
    createBeneficiary,
    getMyBeneficiaries,
    deleteBeneficiary,
    updateBeneficiary
} from "./beneficiary.controller.js";
import { authenticateUser } from "../../middlewares/authenticateUser.js";

export const beneficiaryRouter = Router();

beneficiaryRouter.post("/", authenticateUser, createBeneficiary);
beneficiaryRouter.get("/", authenticateUser, getMyBeneficiaries);
beneficiaryRouter.delete("/:id", authenticateUser, deleteBeneficiary);
beneficiaryRouter.put("/:id", authenticateUser, updateBeneficiary);
