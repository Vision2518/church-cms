import dotenv from "dotenv";
dotenv.config();

import express from "express";
// Ensure the extension .js is explicitly here too
import testRoutes from "./routes/testRoutes.js"; 
import offeringRoutes from "./routes/offering.route.js";
const  app = express();

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});

app.use(express.json());

app.use("/api/test", testRoutes);
app.use("/api/offerings", offeringRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is happily running on port ${PORT}`);
});
