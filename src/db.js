import mongoose from 'mongoose';

const connectDB = async () => {
    const dbUrl = process.env.NODE_ENV === 'test' ? process.env.MONGODB_TEST_URL : process.env.MONGODB_URL;
    if (!dbUrl) {
        throw new Error('Database URL is undefined. Check your environment variables.');
    }

    try {
        await mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

export default connectDB;
