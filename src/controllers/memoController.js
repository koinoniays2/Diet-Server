// import Memo from "../model/memo";

export const getMemo = async (req, res) => res.status(200).json({ result: true, message: "getMemo" });
export const createMemo = async (req, res) => res.status(200).json({ result: true, message: "createMemo" });
export const deleteMemo = async (req, res) => res.status(200).json({ result: true, message: "deleteMemo" });
export const updateMemo = async (req, res) => res.status(200).json({ result: true, message: "updateMemo" });