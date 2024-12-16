
import Folder from "../model/folder";
export const getFolder = async (req, res) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).send({ result: false, message: "로그인이 필요합니다." });
    }

    try {
        const folders = await Folder.find({ userId }).sort({ createdAt: -1 });

        if(!folders) return res.status(401).send({ result: false, data: "폴더를 생성해 주세요." });

        return res.status(200).send({ result: true, data: folders });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ result: false, message: "죄송합니다. 서버에 문제가 발생했습니다. 잠시 후 다시 시도해 주세요." });
    }
};

export const createFolder = async (req, res) => {
    const { folderName } = req.body;
    // 로그인된 사용자 ID 가져오기
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).send({ result: false, message: "로그인이 필요합니다." });
    }
    // 폴더명 빈 값 확인
    if (!folderName || folderName.trim() === "") {
        return res.status(400).send({ result: false, message: "폴더명을 입력하세요." });
    }
    try {
        // 폴더명 중복확인
        const folderExists = await Folder.findOne({ folderName, userId });
        if (folderExists) {
            return res.status(409).send({ result: false, message: "이미 사용중인 폴더명입니다." });
        }
        // 폴더 생성
        const data = await Folder.create({
            folderName,
            userId,
            createdAt: new Date()
        });

        return res.status(201).send({ result: true, message: "폴더가 생성되었습니다." });
    } catch(error) {
        console.log(error);
        return res.status(500).send({ result: false, message: "죄송합니다. 서버에 문제가 발생했습니다. 잠시 후 다시 시도해 주세요." });
    }
};

export const deleteFolder = async (req, res) => {
    const { folderId } = req.body;

    if (!folderId || folderId.length === 0) {
        return res.status(400).json({ result: false, message: "삭제할 폴더를 선택해 주세요." });
    }

    try {
        await Folder.deleteMany({ _id: { $in: folderId } });
        return res.status(200).json({ result: true, message: "폴더가 삭제되었습니다." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ result: false, message: "죄송합니다. 서버에 문제가 발생했습니다. 잠시 후 다시 시도해 주세요." });
    }
};