const express = require("express");
const auth = require("../middleware/authMiddleware");
const { getBudget, setBudget } = require("../controller/budgetController");

const router = express.Router();

router.get("/", auth, getBudget);
router.post("/", auth, setBudget);

module.exports = router;