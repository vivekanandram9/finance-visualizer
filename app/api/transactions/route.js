import { connectDB } from "@/lib/db";
import Transaction from "@/models/Transaction";

export async function GET(){
    await connectDB();
    const transactions = await Transaction.find().sort({ date:-1});
    return Response.json(transactions);
}

export async function POST(req){
    await connectDB();
    const body = await req.json();
    const newTransaction = await Transaction.create(body);
    return Response.json(newTransaction);
}

export async function DELETE(req){
    await connectDB();
    const { id } = await req.json();
    await Transaction.findByIdAndDelete(id);
    return Response.json({ success: true});
}

export async function PUT(req){
    await connectDB();
    const { id, ...rest } = await req.json();
    const updated = await Transaction.findByIdAndUpdate(id, rest, { new: true});
    return Response.json(updated);
}