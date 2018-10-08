import { settings as db } from "@/Server/db/datastore";

export default class Settings {
  public static getPreferences() {
    return new Promise(resolve => {
      db.findOne({ _id: 1 }, (err, doc) => {
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
            { _id: 1 },
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
          db.insert({ ...preferences, _id: 1 }, err => {
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
        if (preferences["systel"] && (await Settings.getSystelSRC())) {
          console.log(11);
          resolve(true);
        } else {
          console.log(22);
          resolve(false);
        }
      });
    });
  }

  public static getDatabase() {
    return new Promise(resolve => {
      db.findOne({ _id: 2 }, (err, doc) => {
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
            { _id: 2 },
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
          db.insert({ ...database, _id: 2 }, err => {
            if (err) throw err;

            resolve(true);
          });
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
