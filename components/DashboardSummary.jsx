'use client';
import { useEffect, useState } from 'react';
import { Card } from '../components/ui/card';
import { format } from 'date-fns';

export default function DashboardSummary({ trigger }) {
  const [transactions, setTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const [filtered, setFiltered] = useState([]);
  const [total, setTotal] = useState(0);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/transactions');
      const data = await res.json();
      setTransactions(data);

      const sorted = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
      setRecent(sorted.slice(0, 3));
    };

    fetchData();
  }, [trigger]);

  useEffect(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const filteredTx = transactions.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate.getFullYear() === year && txDate.getMonth() + 1 === month;
    });
    setFiltered(filteredTx);

    // Total
    const totalAmount = filteredTx.reduce((sum, tx) => sum + tx.amount, 0);
    setTotal(totalAmount);

    // Category Breakdown
    const grouped = {};
    for (let tx of filteredTx) {
      const cat = tx.category || 'Others';
      grouped[cat] = (grouped[cat] || 0) + tx.amount;
    }
    const breakdown = Object.entries(grouped)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
    setCategoryBreakdown(breakdown);
  }, [selectedMonth, transactions]);

  const readableMonth = format(new Date(selectedMonth + '-01'), 'MMMM yyyy');

  return (
    <div className="space-y-6 mt-6">
      {/* Month Selector */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">Select Month:</label>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border rounded px-3 py-1 text-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Expenses */}
        <Card className="p-5 rounded-xl border border-border shadow-sm">
          <p className="text-sm text-muted-foreground">Total Expenses ({readableMonth})</p>
          <h2 className="text-2xl font-bold text-foreground mt-1">₹{total}</h2>
        </Card>

        {/* Category Breakdown */}
        <Card className="p-5 rounded-xl border border-border shadow-sm">
          <p className="text-sm text-muted-foreground mb-2">Category Breakdown ({readableMonth})</p>
          {categoryBreakdown.length > 0 ? (
            <ul className="text-sm space-y-1">
              {categoryBreakdown.map((item) => (
                <li key={item.category} className="flex justify-between">
                  <span className="text-foreground">{item.category}</span>
                  <span className="font-medium text-foreground">₹{item.amount}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No transactions in this month</p>
          )}
        </Card>

        {/* Recent Transactions (all time) */}
        <Card className="p-5 rounded-xl border border-border shadow-sm">
          <p className="text-sm text-muted-foreground mb-2">Recent Transactions</p>
          <ul className="text-sm divide-y divide-border">
            {recent.map(tx => (
              <li key={tx._id} className="flex justify-between py-2">
                <div>
                  <span className="font-medium text-foreground">{tx.description}</span>
                  <p className="text-xs text-muted-foreground">
                    {new Date(tx.date).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-foreground font-semibold">₹{tx.amount}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
