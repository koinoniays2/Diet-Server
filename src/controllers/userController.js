import User from "../model/user";
import bcrypt from "bcryptjs";

// 로그인 여부
export const loginStatus = async (req, res) => {
    // console.log("Session:", req.session); // 세션 확인
    try{
        if(req.session.user){ 
            /* 
            클라이언트가 요청 시 전달한 쿠키(세션 ID가 저장 된)를 기반으로, 
            서버는 세션 저장소(req.session.user)에서 해당 세션 ID에 매핑된 데이터를 가져오기 때문에
            다른 사용자의 정보는 노출되지 않는다.(세션 ID는 각 사용자를 고유하게 식별)
            이 과정은 express-session 미들웨어가 자동으로 처리
            */
            res.status(200).json({ result: true, user: req.session.user });
        }else {
            res.status(200).json({ result: false, user: null });
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({ result: false, message: "죄송합니다. 서버에 문제가 발생했습니다. 잠시 후 다시 시도해 주세요." });
    };
};

export const checkId = async (req, res) => {
    // console.log(req.body);
    const { id } = req.body;
    if(!id) {
        return res.status(400).json({ result: false, message: "아이디를 입력하세요." });
    };
    try {
        const userExists = await User.findOne({ id });
        return res.status(200).json({ result: !userExists, message: userExists ? "이미 사용중인 아이디입니다." : "사용 가능한 아이디입니다." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ result: false, message: "죄송합니다. 서버에 문제가 발생했습니다. 잠시 후 다시 시도해 주세요." });
    };
};

export const createUser = async (req, res) => {
    // console.log(req.body);
    const {id, password, name, phone1, phone2, phone3, email1, email2} = req.body;
    // 필수 항목 검증
    if (!id || !password || !name || !phone1 || !phone2 || !phone3 || !email1 || !email2) { 
        return res.status(400).json({ result: false, message: "빈 칸을 확인해 주세요." });
    }
    try{
        // 비밀번호 해시
        const hashedPassword = await bcrypt.hash(password, 10);
        // 휴대폰 번호 & 이메일
        const phone = `${phone1}-${phone2}-${phone3}`;
        const email = `${email1}@${email2}`

        const data = await User.create({
            id,
            password : hashedPassword,
            name,
            phone,
            email,
            createdAt: new Date(Date.now() + 9 * 60 * 60 * 1000)
        });

        return res.status(201).json({ result: true, message: "회원가입이 완료되었습니다." });
    }catch(error){
        console.log(error);
        return res.status(500).json({ result: false, message: "죄송합니다. 서버에 문제가 발생했습니다. 잠시 후 다시 시도해 주세요." });
    };
};

export const login = async (req, res) => {
    const { id, password } = req.body;
    if(!id || !password) {
        return res.status(400).json({ result: false, message: "아이디와 비밀번호를 입력해주세요." });
    };

    try{
        // 데이터베이스에서 사용자 찾기
        const user = await User.findOne({ id });
        if (!user) {
            return res.status(401).send({ result: false, message: "아이디 또는 비밀번호를 확인해 주세요." });
        }
        // 입력한 비밀번호와 저장된 해시된 비밀번호 비교
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send({ result: false, message: "아이디 또는 비밀번호를 확인해 주세요." });
        };
        // 로그인 성공
        if (isMatch) {
            /* save() : 세션 저장 완료 후 브라우저로 응답
            (express-session 미들웨어가 자동으로 Set-Cookie 헤더를 생성해 응답에 포함) 
            브라우저는 이 Set-Cookie 헤더를 받아 세션 ID를 저장*/
            req.session.save(() => {
                // 세션에 사용자 데이터 저장
                req.session.user = { // 세션 객체 내에서 데이터를 식별하기 위한 이름 : user
                    name: user.name,
                    email: user.email,
                    id: user._id
                };
                const data = req.session;
                /* 세션 데이터 확인
                console.log(data);
                */
                res.status(200).send({ result: true, data: data });
            });
        };
    }catch(error){
        console.log(error);
        return res.status(500).json({ result: false, message: "죄송합니다. 서버에 문제가 발생했습니다. 잠시 후 다시 시도해 주세요." });
    };
};

// 로그아웃
export const logout = async (req, res) => {
    try{
        req.session.destroy(() => { // 세션 삭제
            res.status(200).json({result: true, message: "로그아웃 성공"});
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({ result: false, message: "죄송합니다. 서버에 문제가 발생했습니다. 잠시 후 다시 시도해 주세요." });
    };
};