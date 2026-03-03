import { DataTypes } from "sequelize";
import { db } from "../../configs/db.js";
import { Account } from "../accounts/account.model.js";

export const Beneficiary = db.define("beneficiary", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    alias: {
        type: DataTypes.STRING,
        allowNull: false
    },

    account_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: "beneficiaries",
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ["account_id", "user_id"] // Previene duplicados
        }
    ]
});