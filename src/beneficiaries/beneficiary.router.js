import { Router } from "express";
import {
    createBeneficiary,
    getMyBeneficiaries,
    deleteBeneficiary,
    updateBeneficiary
} from "./beneficiary.controller.js";

export const beneficiaryRouter = Router();

beneficiaryRouter.post("/", createBeneficiary);
beneficiaryRouter.get("/", getMyBeneficiaries);
beneficiaryRouter.delete("/:id", deleteBeneficiary);
beneficiaryRouter.put("/:id", updateBeneficiary);
