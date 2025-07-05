'use client';
import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export default function ExpenseChart({ trigger }) {
  const [chartData, setChartData] = useState([]);

  const groupByMonth = (transactions) => {
    const monthly = {};

    transactions.forEach((tx) => {
      if (!tx.date) return; // guard
      const date = new Date(tx.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthly[key]) {
        monthly[key] = 0;
      }
      monthly[key] += tx.amount;
    });

    return Object.entries(monthly).map(([month, total]) => ({
      month,
      total,
    }));
  };

  const fetchData = async () => {
    try {
      const res = await fetch('/api/transactions');
      const data = await res.json();
      const grouped = groupByMonth(data);
      console.log("Grouped data for chart:", grouped); // debug
      setChartData(grouped);
    } catch (err) {
      console.error("Chart fetch error", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [trigger]);

  return (
    <div className="w-full h-80 mt-8">
      <h2 className="text-xl font-semibold mb-2">Monthly Expenses</h2>
      {chartData.length === 0 ? (
        <p className="text-muted-foreground text-sm">No expense data yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height="100%" key={chartData.length}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#FF4D4D" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
