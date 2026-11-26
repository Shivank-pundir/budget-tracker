const money = (n) => "₹" + Number(n).toLocaleString("en-IN");

export default function ExpenseList({ expenses, onDelete }) {
  return (
    <div className="card">
      <h2 style={{ fontSize: "1.1rem" }}>Expenses</h2>
      {expenses.length === 0 ? (
        <p className="empty">No expenses yet. Add your first one above.</p>
      ) : (
        <ul className="expense-list">
          {expenses.map((e) => (
          <li key={e._id}>
  <div>
    <div className="name">{e.name}</div>
    <span className={`badge badge-${e.category}`}>{e.category}</span>
  </div>
  <div className="right">
    <strong>{money(e.amount)}</strong>
    <button
      className="remove"
      onClick={() => onDelete(e._id)}
      aria-label={`Remove ${e.name}`}
    >
      ✕
    </button>
  </div>
</li>
          ))}
        </ul>
      )}
    </div>
  );
}