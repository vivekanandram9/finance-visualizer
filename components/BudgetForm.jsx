'use client';
import { useEffect, useState } from 'react';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

const CATEGORIES = ['Food', 'Transport', 'Rent', 'Entertainment', 'Utilities', 'Others'];

export default function BudgetForm() {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const [budgets, setBudgets] = useState(() =>
    CATEGORIES.map((cat) => ({ category: cat, amount: '', month: selectedMonth }))
  );

  useEffect(() => {
    const fetchBudgets = async () => {
      const res = await fetch(`/api/budgets?month=${selectedMonth}`);
      const data = await res.json();

      const updated = CATEGORIES.map((cat) => {
        const existing = data.find((b) => b.category === cat);
        return {
          category: cat,
          amount: existing ? existing.amount : '',
          month: selectedMonth,
        };
      });

      setBudgets(updated);
    };

    fetchBudgets();
  }, [selectedMonth]);

  const handleAmountChange = (i, value) => {
    const updated = [...budgets];
    updated[i].amount = value;
    setBudgets(updated);
  };

  const handleSave = async () => {
    const payload = budgets.map((b) => ({
      ...b,
      amount: Number(b.amount),
      month: selectedMonth,
    }));

    const res = await fetch('/api/budgets', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert('Budgets saved!');
    } else {
      alert('Failed to save');
    }
  };

  return (
    <Card className="p-6 mt-6">
      <h2 className="text-lg font-semibold mb-4">Set Monthly Budgets</h2>

      <div className="flex items-center gap-3 mb-4">
        <label className="text-sm font-medium">Select Month:</label>
        <Input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="max-w-[200px]"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {budgets.map((b, i) => (
          <div key={b.category} className="space-y-1">
            <label className="text-sm font-medium">{b.category}</label>
            <Input
              type="number"
              placeholder="₹ amount"
              value={b.amount}
              onChange={(e) => handleAmountChange(i, e.target.value)}
            />
          </div>
        ))}
      </div>

      <Button onClick={handleSave} className="mt-2">
        Save Budgets
      </Button>
    </Card>
  );
}
