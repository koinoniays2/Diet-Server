import "dotenv/config"; // npm i dotenv
import "./db.js"; // db 연결
import express from "express"; // npm i express
import morgan from "morgan"; // npm i morgan
import cors from "cors"; // npm i cors
import session from "express-session"; // npm i express-session
import MongoStore from "connect-mongo"; // npm i connect-mongo
import userRouter from "./router/userRouter.js";
import memoRouter from "./router/memoRouter.js";
import folderRouter from "./router/folderRouter.js";

const corsOption = {
    origin: "*"
};

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors(corsOption));
// 세션 생성
app.use(session({ // 세션설정
    name: "Session ID", // 세션 쿠키 이름
    secret: "secret", // 세션 데이터를 암호화하고 서명하기 위한 비밀 키
    resave: false, // true면 세션이 변경되지 않아도 항상 저장
    saveUninitialized: false, // 초기화되지 않은 세션을 저장소에 저장하지 않도록 설정(로그인한 사용자에 대해서만 세션이 생성)
    cookie: { // 세션 쿠키의 속성을 설정(세션 쿠키는 세션 ID를 클라이언트에 저장해 서버가 세션을 인식하게 해주는 매개체 역할)
        maxAge: 1000 * 60 * 60 * 24, // 쿠키 만료 시간
        httpOnly: true, // 클라이언트 측(JavaScript)에서 쿠키에 접근하지 못하도록 설정
        secure: false, // HTTPS를 통해서만 쿠키가 전송되도록 설정 (개발 중에는 false, 배포 시 true)
    },
    store: MongoStore.create({ // 서버가 꺼지면 메모리 위에 떠있는 세션이 사라지는것을 방지하기위해 db에 저장
        mongoUrl: process.env.DB_URL + "/diet", // MongoDB에 세션을 저장
    })
}));


app.get("/", (req, res) => { res.send("root"); });
app.use("/user", userRouter);
app.use("/memo", memoRouter);
app.use("/folder", folderRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});

export default app;