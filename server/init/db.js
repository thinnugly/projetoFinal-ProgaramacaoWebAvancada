const mongoose = require("mongoose");
const CONFIG = require("../config/config");

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(CONFIG.mongodb.uri);
        console.log(`MongoDB connected: ${connection.connection.host}.`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); 
    }
};

module.exports = connectDB;
