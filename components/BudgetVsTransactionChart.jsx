'use client';
import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Card } from './ui/card';
import { Input } from './ui/input';

const CATEGORIES = ['Food', 'Transport', 'Rent', 'Entertainment', 'Utilities', 'Others'];

export default function BudgetVsActualChart({ trigger }) {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch transactions
      const txRes = await fetch('/api/transactions');
      const txData = await txRes.json();

      // Filter by selected month
      const filteredTx = txData.filter((tx) => {
        const txDate = new Date(tx.date);
        const txMonth = `${txDate.getFullYear()}-${String(txDate.getMonth() + 1).padStart(2, '0')}`;
        return txMonth === selectedMonth;
      });

      // Group transactions by category
      const actuals = {};
      for (const cat of CATEGORIES) actuals[cat] = 0;
      for (const tx of filteredTx) {
        actuals[tx.category] = (actuals[tx.category] || 0) + tx.amount;
      }

      // Fetch budgets
      const budgetRes = await fetch(`/api/budgets?month=${selectedMonth}`);
      const budgetData = await budgetRes.json();

      const budgets = {};
      for (const cat of CATEGORIES) budgets[cat] = 0;
      for (const b of budgetData) {
        budgets[b.category] = b.amount;
      }

      // Combine data
      const combined = CATEGORIES.map((cat) => ({
        category: cat,
        budget: budgets[cat] || 0,
        actual: actuals[cat] || 0,
      }));

      setChartData(combined);
    };

    fetchData();
  }, [selectedMonth, trigger]); // <- Include trigger here

  return (
    <Card className="p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Budget vs Actual Comparison</h2>
        <Input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="max-w-[180px]"
        />
      </div>

      {chartData.length === 0 ? (
        <p className="text-muted-foreground text-sm">No data to display.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="budget" fill="#8884d8" name="Budget" />
            <Bar dataKey="actual" fill="#82ca9d" name="Actual" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
