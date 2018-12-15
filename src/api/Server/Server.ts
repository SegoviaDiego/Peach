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
      // resolve();
      // return;
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

  public static async parseBackup(callback: any) {
    const Total2 = await Server.getCollection("Total2");
    const Sell2 = await Server.getCollection("Sell2");
    const Total = await Server.getCollection("Total");
    const Cierre = await Server.getCollection("Cierre");

    const OldTotales = await Total2.find({}).toArray();
    const OldSells = await Sell2.find({}).toArray();

    let day,
      cierres: Array<any>,
      isCurrent,
      newTotal: any,
      newCierre: any,
      currentCierreId;

    for (const OldTotal of OldTotales) {
      isCurrent = OldTotal._current;
      day = OldTotal.day;
      cierres = [];

      for (const OldCierre of OldTotal.cierres) {
        newCierre = {
          day,
          start: OldCierre.start
        };

        if (!OldCierre._current) newCierre["end"] = OldCierre.end;

        cierres.push((await Cierre.insertOne(newCierre)).insertedId);

        if (isCurrent && OldCierre._current)
          currentCierreId = cierres[cierres.length - 1];
      }

      newTotal = {
        day,
        cierres
      };

      if (isCurrent) newTotal["_turnoActual"] = currentCierreId;

      await Total.insertOne(newTotal);
    }

    console.log('done');
  }
}
