import path from "path";
import { remote } from "electron";
import { products as pTypes } from "@/vuexTypes";
import Firebird from "./db/Firebird";
import Settings from "@/Server/Settings";
import { MongoClient, Db, Collection } from "mongodb";
import Total from "@/Server/mongodb/Total";
import fs from "fs";

export default class Server {
  private static db: Db;
  private static data = {
    dbName: "Peach",
    url: "mongodb://127.0.0.1:27017",
    loading: true,
    mongodb: false,
    poolSize: 5
  };

  public static initServer(dispatch: any) {
    return new Promise(async resolve => {
      Settings.isSystelReady().then(ready => {
        if (ready) {
          Firebird.createDatabaseCopy().then(() => {
            dispatch(pTypes.syncToSystel).then(async () => {
              Firebird.listenForChanges();
              resolve();
            });
          });
        } else {
          Total.getCurrent().then(() => {
            resolve();
          });
        }
      });
    });
  }

  private static initMongo() {
    return new Promise(resolve => {
      MongoClient.connect(
        Server.data.url,
        {
          poolSize: Server.data.poolSize,
          useNewUrlParser: true
        },
        (err: any, client: any) => {
          Server.data.loading = false;
          if (err) {
            resolve(false);
            throw err;
          } else {
            Server.db = client.db(Server.data.dbName);
            Server.data.mongodb = true;
            console.log("Connected successfully to MongoDB");
            resolve(true);
          }
        }
      );
    });
  }

  static getCollection(name: string): Promise<Collection> {
    return new Promise((resolve: any) => {
      if (Server.data.mongodb) {
        resolve(Server.db.collection(name));
      } else {
        Settings.getMongoURL().then((url: any) => {
          if (url) {
            Server.data.url = url;
            Server.initMongo().then(() => {
              resolve(Server.db.collection(name));
            });
          }
        });
      }
    });
  }
}
