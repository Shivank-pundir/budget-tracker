import { useState } from "react";

const empty = { name: "", amount: "", category: "Food" };

export default function ExpenseForm({ onAdd }) {
  const [form, setForm] = useState(empty);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await onAdd({ ...form, amount: Number(form.amount) });
    if (ok) setForm(empty); // clear the form only if the expense was accepted
  };

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <div className="row">
        <input
          name="name"
          placeholder="What did you buy?"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="amount"
          type="number"
          min="1"
          placeholder="Amount (₹)"
          value={form.amount}
          onChange={handleChange}
          required
        />
      </div>
      <div className="row">
        <select name="category" value={form.category} onChange={handleChange}>
          <option>Food</option>
          <option>Travel</option>
          <option>Shopping</option>
          <option>Bills</option>
          <option>Other</option>
        </select>
        <button>Add expense</button>
      </div>
    </form>
  );
}