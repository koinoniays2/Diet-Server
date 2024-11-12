import mongoose from "mongoose";
// 스키마 정의
const memoSchema = new mongoose.Schema({
    writer: String,
    title: String,
    memo: String,
    folderName: String,
    createdAt: Date
})

const Memo = mongoose.model("Memo", memoSchema);

export default Memo;