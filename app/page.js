'use client';
import { useState } from "react";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import ExpenseChart from "../components/ExpenseChart";
import CategoryPieChart from "../components/CategoryPieChart";
export default function HomePage(){
  const [editData, setEditData] = useState(null);
  const [refreshKey, setRefreshkey] = useState(0);

  const refresh = () => setRefreshkey((prev) => prev + 1);
  const clearEdit = () => setEditData(null);
  return (
    <main className="min-h-screen bg-muted py-8 px-4">
  <div className="max-w-2xl mx-auto bg-background rounded-xl shadow-lg p-6 space-y-6">
    <h1 className="text-3xl font-bold text-center">💰 Personal Finance Visualizer</h1>

    <TransactionForm
      fetchTransactions={refresh}
      editData={editData}
      clearEdit={clearEdit}
    />

    <TransactionList
      fetchTransactionsTrigger={refreshKey}
      onEdit={(tx) => setEditData(tx)}
    />

    <ExpenseChart trigger={refreshKey} />
    <CategoryPieChart trigger={refreshKey} />
    
  </div>
</main>

    
  );
}
