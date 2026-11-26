// returns the current month as "YYYY-MM", e.g. "2026-11"
module.exports = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};