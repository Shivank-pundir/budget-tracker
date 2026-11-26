const Budget = require("../model/budget");
const Expense = require("../model/expence");
const getMonth = require("../utils/getMonth");

// GET /api/expenses
exports.getExpenses = async (req, res) => {
  try {
    const month = req.query.month || getMonth();
    const expenses = await Expense.find({ user: req.userId, month }).sort({ createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/expenses   body: { name, amount, category }
exports.addExpense = async (req, res) => {
  try {
    const { name, category } = req.body;
    const amount = Number(req.body.amount);
    const month = getMonth();

    if (!name || !amount || amount <= 0) {
      return res.status(400).json({ message: "Enter what you bought and a valid amount" });
    }

    const budget = await Budget.findOne({ user: req.userId, month });
    if (!budget) {
      return res.status(400).json({ message: "Set your monthly budget first" });
    }

    const expenses = await Expense.find({ user: req.userId, month });
    const spent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const remaining = budget.amount - spent;

    // THE MAIN RULE: block the purchase if it is more than what is left
    if (amount > remaining) {
      return res.status(400).json({
        message: `You can't spend more. You only have ₹${remaining} left in your budget.`,
      });
    }

    const expense = await Expense.create({
      user: req.userId,
      month,
      name,
      amount,
      category,
    });

    res.status(201).json({ expense, remaining: remaining - amount });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/expenses/:id
exports.deleteExpense = async (req, res) => {
  try {
    // user: req.userId makes sure you can only delete your own expenses
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense removed" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};