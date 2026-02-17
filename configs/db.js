import { db } from "../../kinRural-server-admin/configs/db.js";

export { db };

export const dbConnection = async () => {
    try {
        await db.authenticate();
        console.log("✅ Server-User: PostgreSQL connection OK (shared DB)");
    } catch (err) {
        console.error("❌ Server-User DB connection failed:", err.message);
        process.exit(1);
    }
};
