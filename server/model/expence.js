const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    month: { type: String, required: true }, // format: "YYYY-MM"
    name: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 1 },
    category: {
      type: String,
      enum: ["Food", "Travel", "Shopping", "Bills", "Other"],
      default: "Other",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);