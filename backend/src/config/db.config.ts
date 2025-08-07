import mongoose from "mongoose";

export const connectDB = async function () {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI as string);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Failed to connect to DB");
        process.exit(1);
    }
};
