import { products as pTypes } from "@/vuexTypes";
import Firebird from "./db/Firebird";
import Settings from "@/Server/Settings";
import { MongoClient, Db, Collection } from "mongodb";

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
          dispatch(pTypes.syncToSystel).then(async () => {
            Firebird.listenForChanges(await Settings.getSystelSRC());
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
      if (Server.data.mongodb) resolve(Server.db.collection(name));
      else
        Server.initMongo().then(() => {
          resolve(Server.db.collection(name));
        });
    });
  }
}
