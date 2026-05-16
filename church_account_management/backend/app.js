import dotenv from "dotenv";
dotenv.config();

import express from "express";
// Ensure the extension .js is explicitly here too
import testRoutes from "./routes/testRoutes.js"; 
import offeringRoutes from "./routes/offering.route.js";
const  app = express();
app.use(express.json());

app.use("/api/test", testRoutes);
app.use("/api/offerings", offeringRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is happily running on port ${PORT}`);
});