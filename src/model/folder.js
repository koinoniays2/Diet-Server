import mongoose from "mongoose";
// 스키마 정의
const folderSchema = new mongoose.Schema({
    writer: String,
    folderName: String,
    createdAt: Date
});

const Folder = mongoose.model("Folder", folderSchema);

export default Folder;