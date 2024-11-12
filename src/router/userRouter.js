import express from "express";
import { checkId, createUser, login } from "../controllers/userController";

const userRouter = express.Router();

userRouter.post("/check-id", checkId);
userRouter.post("/create", createUser);
userRouter.post("/login", login);

export default userRouter;