'use client';
import { useState } from "react";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import ExpenseChart from "../components/ExpenseChart";
import CategoryPieChart from "../components/CategoryPieChart";
import DashboardSummary from "../components/DashboardSummary";
import BudgetVsTransaction from "../components/BudgetVsTransactionChart";
import BudgetForm from "../components/BudgetForm";
import SpendingInsights from "../components/SpendingInsights";
import { Card } from "../components/ui/card";

export default function HomePage() {
  const [editData, setEditData] = useState(null);
  const [refreshKey, setRefreshkey] = useState(0);

  const refresh = () => setRefreshkey((prev) => prev + 1);
  const clearEdit = () => setEditData(null);

  return (
    <main className="min-h-screen bg-muted py-8 px-4">
      <div className="w-[95%] max-w-6xl mx-auto bg-background rounded-xl shadow-lg p-6 space-y-10">
        <h1 className="text-3xl font-bold text-center text-foreground">
          Personal Finance Visualizer
        </h1>

        {/* Budgeting Section */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Set Monthly Budgets</h2>
          <BudgetForm />
        </section>

        {/* Transaction Form */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Add / Edit Transactions</h2>
          <TransactionForm
            fetchTransactions={refresh}
            editData={editData}
            clearEdit={clearEdit}
          />
        </section>

        {/* Transaction Table */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Transactions</h2>
          <TransactionList
            fetchTransactionsTrigger={refreshKey}
            onEdit={(tx) => setEditData(tx)}
          />
        </section>

        {/* Charts Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Charts</h2>
          <div className="flex flex-col sm:flex-row gap-6">
            <Card className="flex-1 p-4">
              <ExpenseChart trigger={refreshKey} />
            </Card>
            <Card className="flex-1 p-4">
              <CategoryPieChart trigger={refreshKey} />
            </Card>
          </div>
        </section>

        {/* Budget vs Actual Chart */}
        <section>
          <BudgetVsTransaction trigger={refreshKey}/>
        </section>

        {/* Insights */}
        <section>
          <SpendingInsights />
        </section>

        {/* Summary Section */}
        <section>
          <DashboardSummary trigger={refreshKey} />
        </section>
      </div>
    </main>
  );
}
