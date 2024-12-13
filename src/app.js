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
import { authMiddleware } from "./middleware/authMiddleware.js";

const corsOption = {
    origin: ["http://localhost:3000", "https://folder-memo.vercel.app"], // credentials: "include" 옵션을 사용할 때는 *가 아닌 정확한 도메인으로 설정
    credentials: true // 쿠키 허용
};
const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors(corsOption));
app.set("trust proxy", 1);/* 프록시 설정 (Vercel 등 플랫폼에서 필수)
클라이언트가 HTTPS로 요청을 보내도 프록시(Vercel)는 내부적으로 Express에 HTTP로 요청을 보낸다.
=> secure: true로 설정된 쿠키가 작동하지 않음.
하지만, app.set("trust proxy", 1);을 하게되면 원래 요청의 프로토콜(HTTPS)을 
x-forwarded-proto: https 헤더에 담아 함께 전달. 
Express는 x-forwarded-proto, x-forwarded-* 헤더를 신뢰하고, 요청의 원래 프로토콜이 HTTPS였음을 인식 
=> secure : true 쿠키 작동 가능
trust proxy는 Express에게 "이 요청은 프록시 서버를 거쳐 왔다"고 알려주는 설정
1은 1단계 프록시(1개의 중간 서버(프록시)): 클라이언트 → [Vercel 프록시] → Express 서버
chrome://settings/cookies => 시크릿 모드에서 서드 파티 쿠키 차단 : 쿠키 사용 불가
// 디버깅 로그 추가
app.use((req, res, next) => {
    console.log("Protocol:", req.protocol); // 요청의 프로토콜이 HTTP인지 HTTPS인지 확인
    console.log("Secure cookies allowed:", req.secure); // 요청이 HTTPS로 들어왔는지 여부를 boolean으로 나타냅
    next();
});
*/

// 세션 설정 정의
app.use(session({
    name: "SessionID", // 세션 쿠키 이름
    secret: "secret", // 세션 데이터를 암호화하고 서명하기 위한 비밀 키
    resave: false, // true면 세션 데이터가 변경되지 않아도 클라이언트의 요청이 있을 때마다 저장소에 세션 데이터를 덮어씀
    saveUninitialized: false, // 초기화되지 않은 세션을 저장소에 저장하지 않도록 설정(로그인한 사용자에 대해서만 세션이 생성)
    cookie: { // 세션 쿠키의 속성을 설정(세션 쿠키는 세션 ID를 클라이언트에 저장해 서버가 세션을 인식하게 해주는 매개체 역할)
        maxAge: 1000 * 60 * 60 * 24, // 쿠키 만료 시간
        httpOnly: true, // 클라이언트 측(JavaScript)에서 쿠키에 접근하지 못하도록 설정
        secure: process.env.NODE_ENV === "production", // HTTPS를 통해서만 쿠키가 전송되도록 설정 (개발 중에는 false, 배포 시 true)
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // sameSite: "none" => 크로스사이트 요청에서 허용(secure: true가 필요)
        // NODE_ENV는 자동으로 설정됨
    },
    store: MongoStore.create({
        mongoUrl: process.env.DB_URL + "/diet",
    }) /* 별도 저장소(store)를 설정하지 않으면, 세션 데이터는 메모리(RAM) 저장소가 기본값(서버가 실행 중일때만 유지)
    서버가 꺼지거나 여러 서버를 사용할 때도 세션 데이터를 잃지 않고 공유하기 위해 DB에 저장 */
}));

// 라우터
app.get("/", (req, res) => { res.send("root"); });
app.use("/user", userRouter);
app.use("/memo", authMiddleware, memoRouter);
app.use("/folder", authMiddleware, folderRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});

export default app;