const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    month: { type: String, required: true }, // format: "YYYY-MM"
    amount: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

// a user can have only one budget for a given month
budgetSchema.index({ user: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("Budget", budgetSchema);