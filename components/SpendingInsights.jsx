'use client';
import { useEffect, useState } from 'react';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';

const CATEGORIES = ['Food', 'Transport', 'Rent', 'Entertainment', 'Utilities', 'Others'];

export default function SpendingInsights() {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const [insights, setInsights] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const txRes = await fetch('/api/transactions');
      const txData = await txRes.json();

      const budgetRes = await fetch(`/api/budgets?month=${selectedMonth}`);
      const budgetData = await budgetRes.json();

      const actuals = {};
      for (const cat of CATEGORIES) actuals[cat] = 0;

      txData.forEach(tx => {
        const txDate = new Date(tx.date);
        const txMonth = `${txDate.getFullYear()}-${String(txDate.getMonth() + 1).padStart(2, '0')}`;
        if (txMonth === selectedMonth) {
          actuals[tx.category] = (actuals[tx.category] || 0) + tx.amount;
        }
      });

      const budgets = {};
      for (const b of budgetData) {
        budgets[b.category] = b.amount;
      }

      const result = CATEGORIES.map(cat => {
        const actual = actuals[cat] || 0;
        const budget = budgets[cat] || 0;
        const percent = budget > 0 ? ((actual / budget) * 100).toFixed(1) : null;

        if (budget === 0 && actual === 0) return null;

        return {
          category: cat,
          budget,
          actual,
          percent,
          status:
            budget === 0
              ? 'No budget set'
              : actual > budget
              ? 'Over budget'
              : 'Under budget',
        };
      }).filter(Boolean);

      setInsights(result);
    };

    fetchData();
  }, [selectedMonth]);

  return (
    <Card className="p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold"> Spending Insights</h2>
        <Input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="max-w-[180px]"
        />
      </div>

      {insights.length === 0 ? (
        <p className="text-muted-foreground text-sm">No insights available for this month.</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {insights.map((item) => (
            <li key={item.category} className="border-b pb-2">
              <strong>{item.category}</strong>: ₹{item.actual} spent /
              ₹{item.budget} budgeted (
              {item.percent ? `${item.percent}% used` : item.status})
              {item.status === 'Over budget' && (
                <span className="text-red-500 ml-2 font-medium">⚠️ Over budget!</span>
              )}
              {item.status === 'Under budget' && (
                <span className="text-green-600 ml-2 font-medium">🟢 You're on track</span>
              )}
              {item.status === 'No budget set' && (
                <span className="text-muted-foreground ml-2">⚪ No budget set</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
