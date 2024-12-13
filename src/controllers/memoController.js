// import Memo from "../model/memo";

import Folder from "../model/folder";
import Memo from "../model/memo";

// 메모 불러오기
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

        return res.status(200).json({ result: true, memo: memos });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ result: false, message: "서버 에러가 발생했습니다." });
    }
};

// 폴더 안 메모 여부 업데이트 함수
async function updateExistMemo(folderId, memoContent) {
    const folder = await Folder.findById(folderId);
    if (!folder) {
        throw new Error("폴더를 찾을 수 없습니다.");
    }

    // 메모 내용이 비어있으면 0, 그렇지 않으면 1
    folder.existMemo = memoContent.trim() === "" ? 0 : 1;
    await folder.save();
}
// 폴더명 업데이트 함수
async function updateFolderName(folderId, folderName) {
    const folder = await Folder.findById(folderId);
    if (folder && folder.folderName !== folderName) {
        folder.folderName = folderName;
        await folder.save();
    }
}

// 메모 생성 및 수정
export const createMemo = async (req, res) => {
    const { folderId, folderName, memo } = req.body;
    const userId = req.user?.id;
    // 로그인 확인
    if (!userId) return res.status(401).send({ result: false, message: "로그인이 필요합니다." });

    try {
        // 폴더 접근 권한 확인 (선택 사항)
        const folder = await Folder.findOne({ _id: folderId, userId });
        if (!folder) {
            return res.status(403).send({ result: false, message: "이 폴더에 접근할 권한이 없습니다." });
        }

        // 이미 해당 folderId로 작성된 메모가 있는지 확인
        const existingMemo = await Memo.findOne({ folderId, userId });
        // 메모 업데이트 및 생성
        if (existingMemo) {
            // 메모 업데이트
            existingMemo.memo = memo;
            existingMemo.folderName = folderName;
            existingMemo.createdAt = new Date();
            await existingMemo.save();

            // 폴더명 업데이트
            await updateFolderName(folderId, folderName);
            // 폴더 안 메모 여부
            await updateExistMemo(folderId, memo);

            return res.status(200).send({ result: true, memo: existingMemo });
        } else {
            // 새 메모 생성
            const newMemo = await Memo.create({
                folderId,
                folderName,
                memo,
                userId,
                createdAt: new Date(),
            });
            // 폴더명 업데이트
            await updateFolderName(folderId, folderName);
            // 폴더 안 메모 여부
            await updateExistMemo(folderId, memo);

            return res.status(201).send({ result: true, memo: newMemo });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ result: false, message: "서버 에러가 발생했습니다." });
    }
};