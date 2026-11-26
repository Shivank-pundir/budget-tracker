require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./route/authRoutes");
const budgetRoutes = require("./route/budgetRoutes");
const expenseRoutes = require("./route/expenseRoutes");

const app = express();
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173").split(",");
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use("/api/auth", authRoutes); 
app.use("/api/auth", authRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/expenses", expenseRoutes);

app.get("/", (req, res) => res.send("API is running"));

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});