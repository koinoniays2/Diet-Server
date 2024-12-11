import mongoose from "mongoose";
// 스키마 정의
const folderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    folderName: String,
    createdAt: Date
});

const Folder = mongoose.model("Folder", folderSchema);

export default Folder;