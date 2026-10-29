import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

if(!process.env.MONGODB_URL) {
    throw new Error("MONGODB_URL is not defined")
}

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("Database connected")
    } catch (error) {
        console.log("MongoDB connection error", error)
        process.exit(1)
    }
}

export default connectDB