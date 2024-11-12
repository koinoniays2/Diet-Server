import express from "express";
import { checkId, createUser, login, loginStatus } from "../controllers/userController";

const userRouter = express.Router();

userRouter.post("/check-id", checkId);
userRouter.post("/create", createUser);
userRouter.post("/login", login);

// 로그인 여부
userRouter.get("/login-status", loginStatus);

export default userRouter;