const mongoose = require('mongoose');

class Database {
    constructor() {
        this.mongoUrl = process.env.MONGO_URL || process.env.DATABASE_URL || 'mongodb+srv://FCaetano:FCaetano@cluster0.erktrrv.mongodb.net/concesionaria?retryWrites=true&w=majority&appName=Cluster0';
    }

    async connect() {
        try {
            await mongoose.connect(this.mongoUrl);
            // Connection successful
        } catch (error) {
            error.message = 'Error connecting to MongoDB: ' + error.message;
            // MongoDB connection failed
            process.exit(1);
        }
    }

    async disconnect() {
        try {
            await mongoose.connection.close();
            // Disconnected from MongoDB
        } catch (error) {
            error.message = 'Error disconnecting from MongoDB: ' + error.message;
            // Error disconnecting from MongoDB
        }
    }

    getConnectionState() {
        return mongoose.connection.readyState;
    }
}

module.exports = new Database();