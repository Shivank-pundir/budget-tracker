const Budget = require("../model/budget");
const Expense = require("../model/expence");
const getMonth = require("../utils/getMonth");

// helper: budget, spent and remaining for one user and month
const getSummary = async (userId, month) => {
  const budget = await Budget.findOne({ user: userId, month });
  const expenses = await Expense.find({ user: userId, month });
  const spent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const total = budget ? budget.amount : 0;
  return { month, budget: total, spent, remaining: total - spent };
};

// GET /api/budget
exports.getBudget = async (req, res) => {
  try {
    const month = req.query.month || getMonth();
    res.json(await getSummary(req.userId, month));
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/budget   body: { amount }
exports.setBudget = async (req, res) => {
  try {
    const amount = Number(req.body.amount);
    const month = getMonth();

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Enter a budget greater than 0" });
    }

    // don't allow a budget lower than what is already spent
    const { spent } = await getSummary(req.userId, month);
    if (amount < spent) {
      return res.status(400).json({
        message: `Budget can't be less than what you already spent (₹${spent})`,
      });
    }

    // update this month's budget, or create it if it doesn't exist
    await Budget.findOneAndUpdate(
      { user: req.userId, month },
      { amount },
      { upsert: true, new: true }
    );

    res.json(await getSummary(req.userId, month));
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};