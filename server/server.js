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

// make sure the database is connected before any route runs
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    res.status(500).json({ message: "Database connection failed" });
  }
});

app.get("/", (req, res) => res.send("API is running"));
app.use("/api/auth", authRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/expenses", expenseRoutes);

// listen only on your own computer; Vercel runs the exported app itself
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;