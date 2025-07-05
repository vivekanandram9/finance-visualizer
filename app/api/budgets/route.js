import { connectDB } from "../../../lib/db";
import Budget from "../../../models/budget";

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month");

  if (!month) {
    return Response.json({ error: "Month is required" }, { status: 400 });
  }

  const budgets = await Budget.find({ month });
  return Response.json(budgets);
}

export async function POST(req) {
  await connectDB();
  const body = await req.json(); // [{ category, amount, month }, ...]

  if (!Array.isArray(body)) {
    return Response.json({ error: "Expected array of budget entries" }, { status: 400 });
  }

  const results = [];

  for (const entry of body) {
    const { category, amount, month } = entry;

    const existing = await Budget.findOne({ category, month });

    if (existing) {
      existing.amount = amount;
      await existing.save();
      results.push(existing);
    } else {
      const created = await Budget.create({ category, amount, month });
      results.push(created);
    }
  }

  return Response.json(results);
}
