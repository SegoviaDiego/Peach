import { products as pTypes } from "@/vuexTypes";
import Firebird from "./db/Firebird";
import { MongoClient, Db, Collection } from "mongodb";
firebase.initializeApp(config);

export default class Server {
  private static db: Db;
  private static data = {
    dbName: "Peach",
    url: "mongodb://127.0.0.1:27017",
    loading: true,
    mongodb: false,
    poolSize: 5
  };
  private static firebaseConfig = {
    apiKey: "AIzaSyBDSvOGpiIoDsQ4cxw_UO1yupgDVKIchOQ",
    authDomain: "oxymoron-peach.firebaseapp.com",
    databaseURL: "https://oxymoron-peach.firebaseio.com",
    projectId: "oxymoron-peach",
    storageBucket: "oxymoron-peach.appspot.com",
    messagingSenderId: "904895848471"
  };

  public static initServer(dispatch: any) {
    return new Promise(async resolve => {
      dispatch(pTypes.syncToSystel).then(() => {
        Firebird.listenForChanges("C:/projects/qendra.fdb");
        resolve();
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
