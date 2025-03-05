import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error('Please define MONGODB_URI in .env.local');
        }

        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log('Database connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}