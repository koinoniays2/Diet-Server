import express from "express";
import { createFolder, deleteFolder, getFolder, UpdateFolder } from "../controllers/folderController";

const folderRouter = express.Router();

folderRouter.get("/list", getFolder);
folderRouter.get("/create", createFolder);
folderRouter.get("/delete", deleteFolder);
folderRouter.get("/update", UpdateFolder);

export default folderRouter;