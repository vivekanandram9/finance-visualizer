import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
    amount: Number,
    description: String,
    date: Date,
});

export default mongoose.models.transaction || mongoose.model("transaction", TransactionSchema);