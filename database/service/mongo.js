import mongoose from "mongoose";

export async function dbConnect() {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected With Mongo Atlas")
        return connection;
    } catch (error) {
        console.log(error);
    }
}