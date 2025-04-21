import mongoose from 'mongoose';
import dotenv from 'dotenv';

// ✅ Load environment variables
dotenv.config();
const dbConnect = async () => {
  try {
    const connection = await mongoose.connect(process.env.DATABASE_URL); 
    console.log(`✅ DB Connected: ${connection.connection.host}`);
  } catch (err) {
    console.error(`❌ Error in DB Connection: ${err.message}`);
    process.exit(1); // Exit process if DB fails
  }
};

export default dbConnect;
