import express from "express";
import { deleteMemo, getMemo, updateMemo, createMemo } from "../controllers/memoController";

const memoRouter = express.Router();

memoRouter.get("/list", getMemo);
memoRouter.post("/create", createMemo);
memoRouter./*post*/get("/delete", deleteMemo);
memoRouter./*put*/get("/update", updateMemo);

export default memoRouter;