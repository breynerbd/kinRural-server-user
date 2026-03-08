import dotenv from "dotenv";
dotenv.config();

import { dbConnection, db } from "./configs/db.js";
import { initServerUser } from "./configs/app.js";
import { setupAssociations } from "./src/associations.js";

import "./src/users/user.model.js";
import "./src/accounts/account.model.js";
import "./src/transactions/transaction.model.js";
import "./src/movements/movement.model.js";
import "./src/cards/card.model.js";
import "./src/beneficiaries/beneficiary.model.js";
import "./src/statements/statement.model.js";
import "./src/loans/loan.model.js";
import "./src/accountRequest/accountRequest.model.js";

const PORT = process.env.PORT || 3006;

const startServerUser = async () => {
    try {
        await dbConnection();
        setupAssociations();

        await db.sync({ alter: true });
        console.log("✅ Tablas USER sincronizadas");

        const app = initServerUser();
        app.listen(PORT, () => {
            console.log(`🚀 Kinrural USER API running at http://localhost:${PORT}/kinrural/v1`);
        });
    } catch (error) {
        console.error("❌ Error starting USER server:", error);
        process.exit(1);
    }
};

startServerUser();