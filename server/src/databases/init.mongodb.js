import mongoose from "mongoose";
import "dotenv/config";

const options = {
    maxPoolSize: 10, // số lượng kết nối tối đa trong pool
    serverSelectionTimeoutMS: 5000, // timeout khi kết nối đến server
    socketTimeoutMS: 45000, // timeout khi gửi yêu cầu đến server
    retryWrites: true // tự retry nếu ghi thất bại
}

const connectString = process.env.DATABASE_URL || "mongodb://localhost:27017/mydatabase";

console.log(`URI_DB:::${connectString}`);

class Database {
    constructor() {
        this.connect();
    }

    connect = async (retries = 5) => {
        while (retries > 0) {
            try {
                await mongoose.connect(connectString, options);
                console.log(`MongoDB connected: ${mongoose.connection.host}`)

                mongoose.connection.on('disconnected', () => {
                    console.warn('MongoDB disconnected - retring....');
                    this.connect();
                });

                break;

            } catch (error) {
                retries--;
                console.error(`Connection failed. Retries left: ${retries}`);
                if (retries === 0) process.exit(1); // thoát ứng dụng nếu không thể kết nối sau nhiều lần thử
                await new Promise(res => setTimeout(res, 3000)); // đợi 3 giây trước khi thử lại
            }
        }
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

const instanceMongodb = Database.getInstance();
export default instanceMongodb;