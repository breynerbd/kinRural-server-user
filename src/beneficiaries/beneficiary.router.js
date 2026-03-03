import { Router } from "express";
import {
    createBeneficiary,
    getMyBeneficiaries,
    deleteBeneficiary,
    updateBeneficiary
} from "./beneficiary.controller.js";
import { onlyUser } from "../../middlewares/onlyUser.js";

export const beneficiaryRouter = Router();

beneficiaryRouter.post("/", onlyUser, createBeneficiary);
beneficiaryRouter.get("/", onlyUser, getMyBeneficiaries);
beneficiaryRouter.delete("/:id", onlyUser, deleteBeneficiary);
beneficiaryRouter.put("/:id", onlyUser, updateBeneficiary);
