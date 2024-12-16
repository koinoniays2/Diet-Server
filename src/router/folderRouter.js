import express from "express";
import { createFolder, deleteFolder, getFolder } from "../controllers/folderController";

const folderRouter = express.Router();

folderRouter.get("/list", getFolder);
folderRouter.post("/create", createFolder);
folderRouter.post("/delete", deleteFolder);

export default folderRouter;