// import Memo from "../model/memo";

import Folder from "../model/folder";
import Memo from "../model/memo";

export const getMemo = async (req, res) => {
    const folderId = req.query.folderId; // 클라이언트에서 보낸 폴더 ID를 쿼리 파라미터로 받음
    const userId = req.user?.id; // 로그인된 사용자 ID 가져오기

    if (!userId) {
        return res.status(401).json({ result: false, message: "로그인이 필요합니다." });
    }

    if (!folderId) {
        return res.status(400).json({ result: false, message: "폴더가 올바르지 않습니다." });
    }

    try {
        // 폴더 ID와 사용자 ID로 메모 찾기
        const memos = await Memo.find({ folderId, userId });

        return res.status(200).json({ result: true, data: memos });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ result: false, message: "서버 에러가 발생했습니다." });
    }
};
export const createMemo = async (req, res) => {
    const { folderId, folderName, memo } = req.body;
    const userId = req.user?.id;
    console.log(folderId);

    // 로그인 확인
    if (!userId) {
        return res.status(401).send({ result: false, message: "로그인이 필요합니다." });
    }

    try {
        // 폴더 접근 권한 확인 (선택 사항)
        const folder = await Folder.findOne({ _id: folderId, userId });
        if (!folder) {
            return res.status(403).send({ result: false, message: "이 폴더에 접근할 권한이 없습니다." });
        }
        const newMemo = await Memo.create({
            folderId,
            folderName,
            memo,
            userId,
            createdAt: new Date(Date.now() + 9 * 60 * 60 * 1000)
        });
        return res.status(201).send({ result: true, memo: newMemo });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ result: false, message: "서버 에러가 발생했습니다." });
    }
};
export const deleteMemo = async (req, res) => res.status(200).json({ result: true, message: "deleteMemo" });
export const updateMemo = async (req, res) => res.status(200).json({ result: true, message: "updateMemo" });