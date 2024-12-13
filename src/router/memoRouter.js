import express from "express";
import { deleteMemo, getMemo, updateMemo, createMemo } from "../controllers/memoController";

const memoRouter = express.Router();

memoRouter.get("/list", getMemo);
memoRouter.post("/create", createMemo);

export default memoRouter;