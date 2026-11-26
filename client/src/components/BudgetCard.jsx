import { useState } from "react";

const money = (n) => "₹" + Number(n).toLocaleString("en-IN");

export default function BudgetCard({ summary, onSetBudget }) {
  const [amount, setAmount] = useState("");
  const { budget, spent, remaining } = summary;

  const percentUsed = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0;
  const low = budget > 0 && remaining <= budget * 0.1; // red when 10% or less is left

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await onSetBudget(Number(amount));
    if (ok) setAmount("");
  };

  return (
  <div className="card budget">
      <div className="sub">Remaining this month</div>
      <div className={`remaining ${low ? "low" : ""}`}>{money(remaining)}</div>
      <div className="bar">
        <div className={low ? "low" : ""} style={{ width: `${percentUsed}%` }} />
      </div>
      <div className="sub">
        {money(spent)} spent of {money(budget)}
      </div>

      <hr className="divider" />

      <form className="row" onSubmit={handleSubmit}>
        <input
          type="number"
          min="1"
          placeholder={budget > 0 ? "Change budget (₹)" : "Set monthly budget (₹)"}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <button>Save budget</button>
      </form>
    </div>
  );
}