import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import BudgetCard from "../components/BudgetCard";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [summary, setSummary] = useState({ budget: 0, spent: 0, remaining: 0 });
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch budget summary and expenses from the backend
  const loadData = async () => {
    try {
      const [b, e] = await Promise.all([api.get("/budget"), api.get("/expenses")]);
      setSummary(b.data);
      setExpenses(e.data);
    } catch (err) {
      if (err.response?.status === 401) logout(); // token expired or invalid
      else toast.error("Could not load your data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSetBudget = async (amount) => {
    try {
      const { data } = await api.post("/budget", { amount });
      setSummary(data);
      toast.success("Budget saved");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save budget");
      return false;
    }
  };

  // the out-of-budget message comes from the server and is shown as a toast
  const handleAddExpense = async (expense) => {
    try {
      await api.post("/expenses", expense);
      await loadData();
      toast.success("Expense added");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not add expense");
      return false;
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      await loadData();
      toast.success("Expense removed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not remove expense");
    }
  };

  if (loading) return <div className="container sub">Loading...</div>;

  return (
    <div className="container">
      <div className="topbar">
        <h1>Hello, {user.name}</h1>
        <button className="ghost" onClick={logout}>Log out</button>
      </div>

      <BudgetCard summary={summary} onSetBudget={handleSetBudget} />
      <ExpenseForm onAdd={handleAddExpense} />
      <ExpenseList expenses={expenses} onDelete={handleDelete} />
    </div>
  );
}