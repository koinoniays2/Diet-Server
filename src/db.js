import mongoose from "mongoose";

mongoose.connect(`${process.env.DB_URL}/diet`);

const db = mongoose.connection;
db.on("error", error => console.error(error));
db.once("open", () => console.log("Connected on DB")); 