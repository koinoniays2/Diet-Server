import mongoose from "mongoose";
// 스키마 정의
const memoSchema = new mongoose.Schema({
    folderId: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", required: true },
    folderName: String,
    memo: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: Date
})

const Memo = mongoose.model("Memo", memoSchema);

export default Memo;