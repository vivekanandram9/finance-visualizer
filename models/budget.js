import mongoose from "mongoose";

const BudgetSchema = new mongoose.Schema({
    month:{type: String, required: true},
    category:{type: String, required: true},
    amount:{type: Number, required: true},
});

export default mongoose.models.budget || mongoose.model("budget", BudgetSchema);