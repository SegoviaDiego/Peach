import { db as lowdb } from "./datastore";
import { settings as types } from "../../vuexTypes";

export default class Settings {
  public static db() {
    return new Promise<any>(async resolve => {
      resolve(lowdb);
    });
  }

  public static getHost() {
    return new Promise(async resolve => {
      Settings.db().then(db => {
        resolve(db.get(`${types.databaseId}.host`).value());
      });
    });
  }

  public static getPreferences() {
    return new Promise(resolve => {
      Settings.db().then(db => {
        resolve(db.get(types.preferencesId).value());
      });
    });
  }

  public static savePreferences(newPreferences: any) {
    return new Promise(resolve => {
      Settings.db().then(db => {
        const oldPreferences = db.get(types.preferencesId).value();

        db.set(types.preferencesId, {
          ...oldPreferences,
          ...newPreferences
        }).write();

        resolve(true);
      });
    });
  }

  public static isSystelReady(): Promise<Boolean> {
    return new Promise(resolve => {
      Settings.getPreferences().then(async (preferences: any) => {
        if (preferences) {
          if (preferences["systel"] && (await Settings.getSystelSRC())) {
            resolve(true);
          } else {
            resolve(false);
          }
        } else {
          resolve(false);
        }
      });
    });
  }

  public static getDatabase() {
    return new Promise(resolve => {
      Settings.db().then(db => {
        resolve(db.get(types.databaseId).value());
      });
    });
  }

  public static saveDatabase(newDatabase: any) {
    return new Promise(resolve => {
      Settings.db().then(db => {
        const oldDatabase = db.get(types.databaseId).value();

        if (newDatabase["isServer"]) {
          newDatabase["host"] = "127.0.0.1";
        }

        db.set(types.databaseId, {
          ...oldDatabase,
          ...newDatabase
        }).write();

        resolve(true);
      });
    });
  }

  public static isServer() {
    return new Promise((resolve, reject) => {
      Settings.db().then(db => {
        resolve(db.has(`${types.databaseId}.isServer`).value());
      });
    });
  }

  public static getRecargoType() {
    return new Promise((resolve, reject) => {
      Settings.getPreferences().then((preferences: any) => {
        resolve(preferences["recargoCreditoPorIndice"] || false);
      });
    });
  }

  // Cloud - START

  public static getCloud() {
    return new Promise(resolve => {
      // db.findOne({ _id: types.cloudId }, (err: any, doc: any) => {
      //   if (err) throw err;
      //   resolve(doc);
      // });
    });
  }

  public static saveCloud(cloud: any) {
    return new Promise(resolve => {
      // Settings.getDatabase().then((doc: any) => {
      //   if (doc) {
      //     db.update(
      //       { _id: types.cloudId },
      //       {
      //         $set: {
      //           ...cloud
      //         }
      //       },
      //       { multi: false },
      //       (err: any) => {
      //         if (err) throw err;
      //         resolve(true);
      //       }
      //     );
      //   } else {
      //     db.insert({ ...cloud, _id: types.cloudId }, (err: any) => {
      //       if (err) throw err;
      //       resolve(true);
      //     });
      //   }
      // });
    });
  }

  // Cloud - END

  public static getMongoURL(): Promise<any> {
    return new Promise(resolve => {
      Settings.getDatabase().then((database: any) => {
        if (database) {
          resolve(database["mongoUrl"]);
        } else {
          resolve(false);
        }
      });
    });
  }

  public static getSystelSRC(): Promise<any> {
    return new Promise(resolve => {
      Settings.getDatabase().then((database: any) => {
        if (database) {
          resolve(database["systel"]);
        } else {
          resolve(false);
        }
      });
    });
  }
}
