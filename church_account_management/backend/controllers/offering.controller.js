import db from "../config/db.js";

// @desc    Add a new church offering record
// @route   POST /api/offerings
// @access  Public (or Protected later)
export const addOffering = async (req, res) => {
    try {
        const { 
            amount, 
            offering_type, 
            ad_date, 
            bs_year, 
            bs_month, 
            bs_day, 
            nepali_date, 
            remark 
        } = req.body;

        // Basic validation checklist
        if (!amount || !offering_type || !ad_date || !bs_year || !bs_month || !bs_day || !nepali_date) {
            return res.status(400).json({ 
                status: "Fail", 
                message: "Missing required fields. Please ensure all date and amount parameters are present." 
            });
        }

        const query = `
            INSERT INTO church_offering 
            (amount, offering_type, ad_date, bs_year, bs_month, bs_day, nepali_date, remark) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [amount, offering_type, ad_date, bs_year, bs_month, bs_day, nepali_date, remark || null];

        // Execute the query using our pool
        const [result] = await db.execute(query, values);

        res.status(201).json({
            status: "Success",
            message: "Church offering recorded successfully!",
            data: {
                id: result.insertId,
                amount,
                offering_type,
                nepali_date
            }
        });

    } catch (error) {
        console.error("❌ SQL Insert Error:", error);
        res.status(500).json({ 
            status: "Error", 
            message: "Internal server error while inserting record.",
            error: error.message 
        });
    }
};