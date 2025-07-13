import dotenv from "dotenv";

dotenv.config();
export const envConfig = {
  ORIGIN:process.env.CLIENT_URL,    
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  MONGODB_URI: process.env.MONGO_URI||"udgskfs",
  DB_NAME: process.env.DB_NAME || 'CloudGride',
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.example.com',
  EMAIL_PORT: parseInt(process.env.EMAIL_PORT || '587', 10),
  EMAIL_USER: process.env.EMAIL_USER || 'your_email_user',
  EMAIL_PASS: process.env.EMAIL_PASS || 'your_email_password',
};