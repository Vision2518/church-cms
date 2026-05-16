import db from "../config/db.connect.js";

// Test 1: Simple text response
export const getWelcomeMessage = (req, res) => {
    res.status(200).json({ message: "Welcome to the Church Management API!" });
};

// Test 2: Active database query response
export const testDbConnection = async (req, res) => {
    try {
        // Runs a quick test query to get the current time from MySQL
        const [rows] = await db.query("SELECT NOW() as dbTime");
        res.status(200).json({
            status: "Success",
            message: "Controller successfully pulled data from DB!",
            time: rows[0].dbTime
        });
    } catch (error) {
        res.status(500).json({ status: "Error", error: error.message });
    }
};
