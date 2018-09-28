import { products as pTypes } from "../../vuexTypes";
import { listenForChanges } from "./Firebird.js";
import { MongoClient, Db } from "mongodb";

export default class Server {
  constructor() {
    Server.db = {};
    Server.data = {
      dbName: "Peach",
      url: "mongodb://127.0.0.1:27017",
      loading: true,
      mongodb: false,
      poolSize: 5
    };
  }

  get loading() {
    return this.data.loading;
  }

  static initServer(dispatch) {
    return new Promise(async resolve => {
      dispatch(pTypes.syncToSystel).then(() => {
        resolve();
        listenForChanges();
      });
      // Server.initMongo().then(() => {
      //   dispatch(pTypes.syncToSystel).then(() => {
      //     resolve();
      //     // listenForChanges();
      //   });
      // });
    });
  }

  static initMongo() {
    return new Promise(resolve => {
      MongoClient.connect(
        Server.data.url,
        {
          poolSize: Server.data.poolSie,
          useNewUrlParser: true
        },
        (err, client) => {
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

  static getCollection(name) {
    console.log(Server.data.mongodb, Server.data.loading, "gcol");
    if (Server.data.mongodb) return Server.db.collection(name);
  }
}
