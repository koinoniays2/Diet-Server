import mongoose from "mongoose";
// 스키마 정의
const userSchema = new mongoose.Schema({
    id: String,
    password: String,
    name: String,
    phone: String,
    email: String,
    createdAt: Date
})

const User = mongoose.model("User", userSchema);

export default User;