import electron from "electron";
import { MongoClient, Db, Collection } from "mongodb";
import Firebird from "./db/Firebird";
import Settings from "./Settings";
import Total from "./mongodb/Total";
import { products as pTypes } from "../../vuexTypes";
import Product from "./mongodb/Product";

export default class Server {
  private static db: Db;
  private static mongoData = {
    dbName: "Peach",
    url: "mongodb://127.0.0.1:27017",
    loading: true,
    mongodb: false,
    poolSize: 5
  };

  public static initServer() {
    return new Promise(async resolve => {
      // Test utf8:
      // console.log("TEST UTF8 ----");
      // await Firebird.testUTF8Seq();
      // await Firebird.testUTF8Query();

      Settings.isSystelReady().then(ready => {
        if (ready) {
          Firebird.createDatabaseCopy().then(() => {
            Product.syncToSystel().then(() => {
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
        Server.initMongo().then(() => {
          resolve(Server.db.collection(name));
        });
      }
    });
  }
}
