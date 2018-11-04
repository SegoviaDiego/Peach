import { products as pTypes } from "@/vuexTypes";
import { MongoClient, Db, Collection } from "mongodb";
import Firebird from "./db/Firebird";
import Settings from "@/Server/Settings";
import Total from "@/Server/mongodb/Total";

// import express from "express";
// import io from "socket.io";
// const server = express().listen(3031);

export default class Server {
  private static db: Db;
  private static mongoData = {
    dbName: "Peach",
    url: "mongodb://127.0.0.1:27017",
    loading: true,
    mongodb: false,
    poolSize: 5
  };

  public static test() {
    // io.listen(server).on("connection", client => {
    //   Total.listenTo(client);
    // });
  }

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
        Server.mongoData.url,
        {
          poolSize: Server.mongoData.poolSize,
          useNewUrlParser: true
        },
        (err: any, client: any) => {
          Server.mongoData.loading = false;
          if (err) {
            resolve(false);
            throw err;
          } else {
            Server.db = client.db(Server.mongoData.dbName);
            Server.mongoData.mongodb = true;
            console.log("Connected successfully to MongoDB");
            resolve(true);
          }
        }
      );
    });
  }

  static getCollection(name: string): Promise<Collection> {
    return new Promise((resolve: any) => {
      if (Server.mongoData.mongodb) {
        resolve(Server.db.collection(name));
      } else {
        Settings.getMongoURL().then((url: any) => {
          if (url) {
            Server.mongoData.url = url;
            Server.initMongo().then(() => {
              resolve(Server.db.collection(name));
            });
          }
        });
      }
    });
  }
}
