export const authMiddleware = (req, res, next) => {
    if (!req.session.user) {
        // 세션에 사용자 정보가 없으면 인증 실패
        return res.status(401).send({ result: false, message: "로그인이 필요합니다." });
    }
    // 세션에서 사용자 정보를 가져와 요청 객체에 추가
    req.user = req.session.user;
    // console.log("Session:", req.session);
    next(); // 다음 미들웨어 또는 라우트로 이동
};