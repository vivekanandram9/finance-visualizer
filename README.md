# 💰 Personal Finance Visualizer

A full-featured web application to track and visualize your personal finances with real-time insights, interactive charts, and monthly budgeting support.

Built using **Next.js (App Router)**, **React**, **MongoDB**, **shadcn/ui**, and **Recharts**.

---

## 🚀 Features

### ✅ Transaction Management
- Add, edit, delete transactions
- Each transaction includes:
  - Amount
  - Date
  - Description
  - Category (predefined list)

### 📋 Transaction List
- Responsive table to view all transactions
- Actions: Edit / Delete
- Transactions sorted by most recent first

### 📊 Charts & Visualizations
- **Monthly Expense Bar Chart** (grouped by month)
- **Category-wise Pie Chart**
- **Budget vs Actual Chart** (for selected month and categories)

### 📅 Monthly Budgeting
- Set category-wise budgets for any selected month
- View and compare with actual spending
- Budget data stored in MongoDB

### 🧠 Spending Insights
- Shows how much budget is used per category
- Highlights:
  - Over Budget ⚠️
  - Under Budget ✅
  - No Budget Set ⚪

### 📌 Dashboard Summary
- Total expenses for selected month
- Category breakdown
- Most recent transactions

---


---

## 📦 Tech Stack

| Layer        | Tech                          |
|--------------|-------------------------------|
| Framework    | Next.js (App Router)          |
| Frontend UI  | React + TailwindCSS + shadcn/ui |
| Charts       | Recharts                      |
| Database     | MongoDB (via Mongoose)        |
| Deployment   | Vercel                        |

---





## Run Locally
-npm install
-npm run dev