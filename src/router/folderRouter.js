import express from "express";
import { createFolder, deleteFolder, getFolder, UpdateFolder } from "../controllers/folderController";

const folderRouter = express.Router();

folderRouter.get("/list", getFolder);
folderRouter.post("/create", createFolder);
folderRouter.post("/delete", deleteFolder);
folderRouter.post("/update", UpdateFolder);

export default folderRouter;