import { remote } from "electron";
import low from "lowdb";
const FileSync = require("lowdb/adapters/FileSync");
// const FileAsync = require("lowdb/adapters/FileAsync");
const dbFolder = remote.app.getPath("userData");

export const db = low(new FileSync(dbFolder + "/settings.json"));
// export const asyncDb = low(new FileAsync(dbFolder + "/settings.json"));
