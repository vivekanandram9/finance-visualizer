'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function TransactionForm({ fetchTransactions, editData, clearEdit }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (editData) {
      setAmount(editData.amount);
      setDescription(editData.description);
      setDate(editData.date.split('T')[0]);
      setEditingId(editData._id);
    }
  }, [editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || !description || !date) {
      alert('All fields are required');
      return;
    }

    const newData = { amount: Number(amount), description, date };

    const res = editingId
      ? await fetch('/api/transactions', {
        method: 'PUT',
        body: JSON.stringify({ id: editingId, ...newData }),
      })
      : await fetch('/api/transactions', {
        method: 'POST',
        body: JSON.stringify(newData),
      });

    if (res.ok) {
      setAmount('');
      setDescription('');
      setDate('');
      setEditingId(null);
      fetchTransactions();
      clearEdit && clearEdit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="flex-1"
        />
        <Input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="flex-1"
        />
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="flex-1"
        />
      </div>
      <Button type="submit" className="w-full sm:w-auto">
        {editingId ? 'Update Transaction' : 'Add Transaction'}
      </Button>
    </form>

  );
}
