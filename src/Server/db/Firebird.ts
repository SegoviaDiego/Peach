import path from "path";
import { remote } from "electron";
import Total from "../mongodb/Total";
import Settings from "@/Server/Settings";
import { composeSystelToKg } from "@/Server/mongodb/Utils";
import fb from "node-firebird";
import fs from "fs";

export default class Firebird {
  private static systelSyncProcess: any;
  private static data = {
    host: "127.0.0.1",
    port: 3050,
    database: path.join(remote.app.getPath("userData"), "systel.fdb"),
    user: "SYSDBA",
    password: "masterkey"
  };

  public static createDatabaseCopy() {
    return new Promise(async resolve => {
      await fs.writeFileSync(
        Firebird.data.database,
        fs.readFileSync(await Settings.getSystelSRC())
      );
      resolve();
    });
  }

  public static listenForChanges() {
    console.log("Listening for Firebird changes");
    Firebird.identifyChange();
    Firebird.startSystelSyncProcess();
  }

  public static startSystelSyncProcess() {
    Firebird.systelSyncProcess = setInterval(async () => {
      await Firebird.createDatabaseCopy();
      Firebird.identifyChange();
    }, 5000);
  }

  public static stopSystelSyncProcess() {
    if (Firebird.systelSyncProcess) {
      clearInterval(Firebird.systelSyncProcess);
      Firebird.systelSyncProcess = null;
    }
  }

  private static identifyChange() {
    fb.attach(Firebird.data, (err: any, db: any) => {
      if (err) throw err;

      db.query(
        "SELECT ID_PLU, PE, CA FROM TOTALES WHERE (CA>0 OR PE>0)",
        [],
        async (err: any, res: any) => {
          db.detach();
          if (err) throw err;

          if (res.length > 0) {
            Total.identifySells(await composeSystelToKg(res));
          } else {
            Total.saveCierre();
          }
        }
      );
    });
  }

  public static backupDatabaseFile() {
    return new Promise(resolve => {
      fs.exists(
        path.join(remote.app.getPath("userData"), `/systelBackup`),
        async (exists: Boolean) => {
          if (exists) {
            const date = new Date();
            const dbName = `${date.getDate()}-${date.getMonth() +
              1}-${date.getFullYear()} ${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}hs`;
            await fs.writeFileSync(
              path.join(
                remote.app.getPath("userData"),
                `/systelBackup/${dbName}.fdb`
              ),
              fs.readFileSync(Firebird.data.database)
            );
          }
          resolve();
        }
      );
    });
  }

  public static getProductList() {
    return new Promise(resolve => {
      fb.attach(Firebird.data, (err: any, db: any) => {
        if (err) throw err;

        const p: any = [];
        db.query(
          "SELECT ID, DESCRIPCION, TIPO_VENTA, PRECIO FROM PLU",
          [],
          (err: any, res: any) => {
            db.detach();
            if (err) throw err;
            res.forEach((item: any) => {
              p.push({
                _id: item.ID.toString(),
                name: item.DESCRIPCION.toString(),
                price: parseFloat(item.PRECIO),
                type: item.TIPO_VENTA.toString("utf8") == "Unidad" ? 0 : 1
              });
            });
            resolve(p);
          }
        );
      });
    });
  }

  public static test(url: string) {
    return new Promise(async resolve => {
      await Firebird.createDatabaseCopy();
      fb.attach(Firebird.data, (err: any, db: any) => {
        if (err) throw err;

        db.query(
          "SELECT ID, DESCRIPCION, TIPO_VENTA, PRECIO FROM PLU",
          [],
          (err: any, res: any) => {
            db.detach();
            console.log(res, err);
            resolve();
          }
        );
      });
    });
  }

  public static clearTotales() {
    return new Promise(async resolve => {
      fb.attach(
        { ...Firebird.data, database: await Settings.getSystelSRC() },
        (err, db) => {
          if (err) throw err;

          db.query("DELETE FROM TOTALES", [], err => {
            db.detach();
            if (err) throw err;
            resolve(true);
          });
        }
      );
    });
  }

  public static isFirebirdAvailable(): Promise<Boolean> {
    return new Promise(async resolve => {
      fb.attach(
        { ...Firebird.data, database: await Settings.getSystelSRC() },
        (err, db) => {
          if (err) {
            resolve(false);
            throw err;
          }

          db.query("SELECT * FROM TOTALES", [], err => {
            db.detach();
            if (err) {
              resolve(false);
              throw err;
            }
            resolve(true);
          });
        }
      );
    });
  }

  // Faker functions

  public static clearSales() {
    return new Promise(async resolve => {
      fb.attach(
        { ...Firebird.data, database: await Settings.getSystelSRC() },
        (err, db) => {
          if (err) throw err;

          db.query("DELETE FROM TOTALES", [], err => {
            db.detach();
            if (err) throw err;
            console.log("deleted");
            resolve();
          });
        }
      );
    });
  }

  public static createSell() {
    return new Promise(async resolve => {
      fb.attach(
        { ...Firebird.data, database: await Settings.getSystelSRC() },
        (err, db) => {
          if (err) throw err;

          db.query(
            "INSERT INTO TOTALES (IP, NUMERO, V1, V2, V3, V4, ID_PLU, ID_SECCION, PE, CA) VALUES (1,1,1,1,1,1,3, 1, 100, 100)",
            [],
            err => {
              db.detach();
              if (err) throw err;
              console.log("created");
              resolve();
            }
          );
        }
      );
    });
  }

  public static getTotals() {
    return new Promise(async resolve => {
      fb.attach(
        { ...Firebird.data, database: await Settings.getSystelSRC() },
        (err, db) => {
          if (err) throw err;

          db.query(
            "SELECT ID_PLU, PE, CA FROM TOTALES WHERE (CA>0 OR PE>0)",
            [],
            (err, res) => {
              db.detach();
              if (err) throw err;
              console.log(res);
              resolve();
            }
          );
        }
      );
    });
  }
}
