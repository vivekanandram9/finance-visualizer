'use client';
import { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';

export default function TransactionList({ fetchTransactionsTrigger, onEdit }) {
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    const res = await fetch('/api/transactions');
    const data = await res.json();
    setTransactions(data);
  };

  const handleDelete = async (id) => {
    await fetch('/api/transactions', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    });
    fetchTransactions();
  };

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactionsTrigger]);

  if (transactions.length === 0) {
    return <p className="text-sm text-muted-foreground">No transactions found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left border-collapse border border-border mt-4 rounded-md overflow-hidden">
        <thead className="bg-muted text-muted-foreground">
          <tr>
            <th className="p-3 border border-border font-medium">Date</th>
            <th className="p-3 border border-border font-medium">Description</th>
            <th className="p-3 border border-border font-medium">Amount (₹)</th>
            <th className="p-3 border border-border font-medium">Category</th>
            <th className="p-3 border border-border font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx._id} className="hover:bg-accent">
              <td className="p-3 border border-border">
                {new Date(tx.date).toLocaleDateString()}
              </td>
              <td className="p-3 border border-border">{tx.description}</td>
              <td className="p-3 border border-border">₹{tx.amount}</td>
              <td className="p-3 border border-border">{tx.category}</td>
              <td className="p-3 border border-border space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(tx)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(tx._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
