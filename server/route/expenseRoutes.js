const express = require("express");
const auth = require("../middleware/authMiddleware");
const {
  getExpenses,
  addExpense,
  deleteExpense,
} = require("../controller/expenseController");

const router = express.Router();

router.get("/", auth, getExpenses);
router.post("/", auth, addExpense);
router.delete("/:id", auth, deleteExpense);

module.exports = router;