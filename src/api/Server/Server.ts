import { MongoClient, Db, Collection } from "mongodb";
import Firebird from "./db/Firebird";
import Product from "./mongodb/Product";
import Total from "./mongodb/Total";
import Cierre from "./mongodb/Cierre";
import Sell from "./mongodb/Sell";
import Log from "./mongodb/Log";
import Settings from "./Settings";
import { log as types } from "../../vuexTypes";
import socketEvents from "../../socketEvents";

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
              Firebird.listenForChanges().then(() => {
                resolve();
              });
              // Total.getTotal(new Date()).then(() => {
              // });
            });
          });
        } else {
          Total.getTotal(new Date()).then(() => {
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

  public static async get(
    event: string,
    data: any,
    callback: (success: boolean, payload: any) => void
  ) {
    switch (event) {
      case socketEvents.default.export:
        Server.getExportFile()
          .then(res => callback(true, res))
          .catch(res => callback(false, res));
        break;
    }
  }

  public static getExportFile() {
    return new Promise(async (resolve, reject) => {
      resolve({
        product: await Product.getFullCollection(),
        total: await Total.getFullCollection(),
        cierre: await Cierre.getFullCollection(),
        sell: await Sell.getFullCollection(),
        logMov: await Log.getFullCollection(types.movLog),
        logIngreso: await Log.getFullCollection(types.inStock),
        logEgreso: await Log.getFullCollection(types.outStock)
      });
    });
  }

  // public static parseBackup(callback: any) {
  //   let newCierre: any;

  //   Server.getCollection("Total2").then(db => {
  //     db.find({}).toArray((err, res) => {
  //       // for each total
  //       Server.getCollection("Total").then(newTotaldb => {
  //         // newTotaldb.deleteMany({}, async () => {
  //         //   for (let item of res) {
  //         //     await newTotaldb.insertOne({
  //         //       day: new Date(item.day),
  //         //       cierres: []
  //         //     });
  //         //   }
  //         // });
  //         callback("----------------- DONE -------------------");
  //       });

  //       // item.cierres.forEach((cierre: any) => {
  //       //   Server.getCollection("Cierre").then(cierredb => {
  //       //     newCierre = {
  //       //       day: cierre.day,
  //       //       start: cierre.start,
  //       //       canceled: false
  //       //     };

  //       //     if (!cierre._current) newCierre["end"] = cierre.end;

  //       //     cierredb.insertOne(newCierre, (err: any, mongoNewCierre) => {
  //       //       if (err) throw err;

  //       //       db.updateOne({ _id: newTotal.insertedId },{
  //       //         $push: {
  //       //           cierres: mongoNewCierre.insertedId
  //       //         }
  //       //       }).then(()=>{

  //       //       })

  //       //     });
  //       //   });
  //       // });
  //     });
  //     return;
  //     db.updateMany(
  //       {},
  //       {
  //         $unset: {
  //           cierres: "",
  //           start: "",
  //           end: "",
  //           total: "",
  //           _current: ""
  //         }
  //       }
  //     ).then(() => {
  //       db.find({}).toArray((err, res) => {
  //         callback(res);
  //       });
  //     });
  //   });
  // }
}
