import dotenv from "dotenv";
import { dbConnection } from "./configs/db.js";
import { initServerUser } from "./configs/app.js";
import { setupAssociations } from "./src/associations.js";

dotenv.config();
const PORT = process.env.PORT || 3006;

const startServerUser = async () => {
    try {
        await dbConnection();
        setupAssociations();
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