import express from "express";
import { createUser, login, loginStatus, logout } from "../controllers/userController";

const userRouter = express.Router();

userRouter.post("/create", createUser);
userRouter.post("/login", login);

userRouter.get("/login-status", loginStatus); // 로그인 여부
userRouter.post("/logout", logout); // 로그아웃


export default userRouter;