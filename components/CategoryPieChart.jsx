'use client';
import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../components/ui/card';

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#BA68C8', '#FFA726'];

export default function CategoryPieChart({ trigger }) {
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    const fetchAndGroup = async () => {
      const res = await fetch('/api/transactions');
      const data = await res.json();

      const grouped = data.reduce((acc, tx) => {
        const cat = tx.category || 'Others';
        acc[cat] = (acc[cat] || 0) + tx.amount;
        return acc;
      }, {});

      const chartData = Object.entries(grouped).map(([category, value]) => ({
        category,
        value,
      }));

      setCategoryData(chartData);
    };

    fetchAndGroup();
  }, [trigger]);

  if (categoryData.length === 0) {
    return <p className="text-sm text-muted-foreground mt-4">No data to display.</p>;
  }

  return (
    <div className="mt-8 w-full">
      <h2 className="text-xl font-semibold mb-2">Spending by Category</h2>
      <Card className="w-full h-[350px] p-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
