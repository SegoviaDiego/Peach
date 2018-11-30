import fs from "fs";
import path from "path";
import fb from "node-firebird";
import { app } from "electron";
import Settings from "../Settings";
import Total from "../mongodb/Total";
import Product from "../mongodb/Product";
import { composeSystelToKg } from "../../Utils";

export default class Firebird {
  private static systelSyncProcess: any;
  private static data = {
    host: "127.0.0.1",
    port: 3050,
    database: path.join(app.getPath("userData"), "systel.fdb"),
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

  public static async listenForChanges() {
    console.log("Listening for Firebird changes");
    // await Firebird.createSell();
    // console.log("SSP ---- 1");
    await Firebird.identifyChange();
    Firebird.startSystelSyncProcess();
  }

  public static startSystelSyncProcess() {
    Firebird.systelSyncProcess = setInterval(async () => {
      await Firebird.createDatabaseCopy();
      await Firebird.identifyChange();
    }, 5000);
  }

  public static stopSystelSyncProcess() {
    if (Firebird.systelSyncProcess) {
      clearInterval(Firebird.systelSyncProcess);
      Firebird.systelSyncProcess = null;
    }
  }

  private static identifyChange() {
    return new Promise(resolve => {
      fb.attach(Firebird.data, (err: any, db: any) => {
        if (err) {
          db.detach();
          throw err;
        }

        db.query(
          "SELECT ID_PLU, PE, CA FROM TOTALES WHERE (CA>0 OR PE>0)",
          [],
          async (err: any, res: any) => {
            db.detach();
            if (err) throw err;

            resolve(
              await Total.analizeTotal(
                await composeSystelToKg(await Product.loadProducts(), res)
              )
            );
          }
        );
      });
    });
  }

  public static backupDatabaseFile() {
    return new Promise(resolve => {
      fs.exists(
        path.join(app.getPath("userData"), `/systelBackup`),
        async (exists: Boolean) => {
          if (exists) {
            const date = new Date();
            const dbName = `${date.getDate()}-${date.getMonth() +
              1}-${date.getFullYear()} ${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}hs`;
            await fs.writeFileSync(
              path.join(app.getPath("userData"), `/systelBackup/${dbName}.fdb`),
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
        if (err) {
          db.detach();
          throw err;
        }

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

  public static clearTotales() {
    return new Promise(async resolve => {
      fb.attach(
        { ...Firebird.data, database: await Settings.getSystelSRC() },
        (err, db) => {
          if (err) {
            db.detach();
            throw err;
          }

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
            db.detach();
            resolve(false);
            console.error("getSystelSrc is not available");
            throw err;
          }

          db.query("SELECT * FROM TOTALES", [], err => {
            db.detach();
            if (err) {
              resolve(false);
              console.error("Select * from Totales returned an error");
              console.error(err);
              return;
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
          if (err) {
            console.log("CREATESELL ---- err 1");
            console.log(err);
            return;
          }

          db.query("SELECT * FROM TOTALES WHERE ID_PLU=3", [], (err, doc) => {
            if (err) {
              console.log("CREATESELL ---- err 2");
              console.log(err);
              return;
            }

            if (doc.length) {
              db.query(
                "UPDATE TOTALES SET PE=PE + 100 WHERE ID_PLU=3",
                [],
                err => {
                  db.detach();
                  if (err) {
                    console.log("CREATESELL ---- err 3");
                    console.log(err);
                    return;
                  }
                  console.log("updated");
                  resolve();
                }
              );
            } else {
              console.log("2----");
              db.query(
                "INSERT INTO TOTALES (IP, NUMERO, V1, V2, V3, V4, ID_PLU, ID_SECCION, PE, CA) VALUES (1,1,1,1,1,1,3, 1, 100, 100)",
                [],
                err => {
                  db.detach();
                  if (err) {
                    console.log("CREATESELL ---- err 4");
                    console.log(err);
                    return;
                  }
                  console.log("created");
                  resolve();
                }
              );
            }
          });
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

  public static testUTF8Query() {
    return new Promise(async resolve => {
      await Firebird.createDatabaseCopy();

      console.log("Init testUTF8");

      fb.attach(Firebird.data, (err: any, db: any) => {
        if (err) throw err;

        console.log("Init Query");

        db.query(
          "SELECT ID, DESCRIPCION, TIPO_VENTA, PRECIO FROM PLU",
          [],
          (err: any, res: any) => {
            db.detach();
            console.log("asdasd ------");
            console.log(res, err);
            resolve();
          }
        );
      });
    });
  }

  public static testUTF8Seq() {
    return new Promise(async resolve => {
      await Firebird.createDatabaseCopy();

      console.log("Init testUTF8");
      fb.attach(Firebird.data, (err: any, db: any) => {
        if (err) throw err;

        console.log("Init seq");

        const p: any = [];
        db.sequentially(
          "SELECT ID, DESCRIPCION FROM PLU",
          [],
          (row: any, index: any) => {
            console.log(row.ID, row.DESCRIPCION);
          },
          (err: any) => {
            if (err) {
              console.log("err ----");
              console.log(err);
            } else {
              console.log("end ----");
            }
            db.detach();
          }
        );
      });
    });
  }
}
