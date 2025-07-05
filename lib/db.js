import mongoose from "mongoose";

export const connectDB = async () => {
    if(mongoose.connection.readyState >= 1) return;

    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDb connected");
    }catch(error){
        console.error("MongoDb connection failed ", error);
    }
};