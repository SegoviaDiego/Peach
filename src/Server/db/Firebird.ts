import path from "path";
import { remote } from "electron";
import Total from "../mongodb/Total";
import { composeSystelToKg } from "@/Server/mongodb/Utils";
import fb from "node-firebird";
import fs from "fs";

export default class Firebird {
  private static data = {
    host: "127.0.0.1",
    port: 3050,
    database: path.join(remote.app.getPath("userData"), "systel.fdb"),
    user: "SYSDBA",
    password: "masterkey"
  };

  public static listenForChanges(db: string) {
    console.log("Listening for Firebird changes");
    Firebird.identifyChange();
    setInterval(() => {
      fs.writeFileSync(Firebird.data.database, fs.readFileSync(db));
      Firebird.identifyChange();
    }, 5000);
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
                _id: item.ID,
                name: item.DESCRIPCION,
                price: item.PRECIO,
                type: item.TIPO_VENTA.toString("utf8") == "Unidad" ? 0 : 1
              });
            });
            resolve(p);
          }
        );
      });
    });
  }

  // Faker functions

  private static clearSales() {
    return new Promise(resolve => {
      fb.attach(Firebird.data, (err, db) => {
        if (err) throw err;

        db.query(
          "DELETE FROM TOTALES WHERE ID_PLU!=99998 AND ID_PLU!=99999 AND (CA>0 OR PE>0)",
          [],
          (err, res) => {
            db.detach();
            if (err) throw err;
            console.log("success");
            resolve();
          }
        );
      });
    });
  }

  private static createSell() {
    return new Promise(resolve => {
      fb.attach(Firebird.data, (err, db) => {
        if (err) throw err;

        // "UPDATE TOTALES SET CA=CA+100 WHERE ID_PLU=1"
        db.query(
          "INSERT INTO TOTALES (IP, NUMERO, V1, V2, V3, V4, ID_PLU, ID_SECCION, PE, CA) VALUES (1,1,1,1,1,1,1, 1, 100, 100)",
          [],
          err => {
            db.detach();
            if (err) throw err;
            setTimeout(() => {
              resolve();
            }, 500);
          }
        );
      });
    });
  }

  private static getTotals() {
    return new Promise(resolve => {
      fb.attach(Firebird.data, (err, db) => {
        if (err) throw err;

        db.query(
          "SELECT ID_PLU, PE, CA FROM TOTALES WHERE ID_PLU!=99998 AND ID_PLU!=99999 AND (CA>0 OR PE>0)",
          [],
          (err, res) => {
            db.detach();
            if (err) throw err;
            setTimeout(() => {
              resolve(res);
            }, 500);
          }
        );
      });
    });
  }
}
