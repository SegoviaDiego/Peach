import { settings as db } from "@/Server/db/datastore";
import { settings as types } from "@/vuexTypes";

export default class Settings {
  public static getPreferences() {
    return new Promise(resolve => {
      db.findOne({ _id: types.preferencesId }, (err, doc) => {
        if (err) throw err;

        resolve(doc);
      });
    });
  }

  public static savePreferences(preferences: any) {
    return new Promise(resolve => {
      Settings.getPreferences().then((doc: any) => {
        if (doc) {
          db.update(
            { _id: types.preferencesId },
            {
              $set: {
                ...preferences
              }
            },
            { multi: false },
            err => {
              if (err) throw err;

              resolve(true);
            }
          );
        } else {
          db.insert({ ...preferences, _id: types.preferencesId }, err => {
            if (err) throw err;

            resolve(true);
          });
        }
      });
    });
  }

  public static isSystelReady() {
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
      db.findOne({ _id: types.databaseId }, (err, doc) => {
        if (err) throw err;
        resolve(doc);
      });
    });
  }

  public static saveDatabase(database: any) {
    return new Promise(resolve => {
      Settings.getDatabase().then((doc: any) => {
        if (doc) {
          db.update(
            { _id: types.databaseId },
            {
              $set: {
                ...database
              }
            },
            { multi: false },
            err => {
              if (err) throw err;

              resolve(true);
            }
          );
        } else {
          db.insert({ ...database, _id: types.databaseId }, err => {
            if (err) throw err;

            resolve(true);
          });
        }
      });
    });
  }

  // Cloud - START

  public static getCloud() {
    return new Promise(resolve => {
      db.findOne({ _id: types.cloudId }, (err, doc) => {
        if (err) throw err;
        resolve(doc);
      });
    });
  }

  public static saveCloud(cloud: any) {
    return new Promise(resolve => {
      Settings.getDatabase().then((doc: any) => {
        if (doc) {
          db.update(
            { _id: types.cloudId },
            {
              $set: {
                ...cloud
              }
            },
            { multi: false },
            err => {
              if (err) throw err;

              resolve(true);
            }
          );
        } else {
          db.insert({ ...cloud, _id: types.cloudId }, err => {
            if (err) throw err;

            resolve(true);
          });
        }
      });
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
