import path from "path";
import { remote } from "electron";
import { identifySells, saveCierre } from "../Src/Total";
import { settings as db } from "../datastore";

const fb = require("node-firebird");
const fs = require("fs");

let options = {
  host: "127.0.0.1",
  port: 3050,
  database: path.join(remote.app.getPath("userData"), "systel.fdb"),
  // database: "C:/Users/YoPC/Desktop/Nueva carpeta/qendra.fdb",
  // database: 'C:/Users/Silvina/AppData/Local/VirtualStore/Program Files (x86)/SYSTEL/qendra.fdb',
  user: "SYSDBA",
  password: "masterkey"
};

export function listenForChanges() {
  db.findOne({ _id: 1 }, (err, doc) => {
    if (err) throw err;
    if (doc) {
      console.log("Listening for Firebird changes");
      setInterval(() => {
        fs.writeFileSync(options.database, fs.readFileSync(doc.src));
        identifyChange();
      }, 5000);
    }
  });
}

export function identifyChange() {
  const totals = [];

  fb.attach(options, (err, db) => {
    if (err) throw err;

    db.query(
      "SELECT ID_PLU, PE, CA FROM TOTALES WHERE ID_PLU!=99998 AND ID_PLU!=99999 AND (CA>0 OR PE>0)",
      [],
      (err, res) => {
        db.detach();
        if (err) throw err;

        if (res.length > 0) {
          res.forEach(item => {
            totals.push({
              _id: item.ID_PLU,
              money: item.PE,
              amount: item.CA
            });
          });
          identifySells(totals);
        } else {
          saveCierre();
        }
      }
    );
  });
}

export function getProductList() {
  return new Promise(resolve => {
    fb.attach(options, (err, db) => {
      if (err) throw err;

      const p = [];
      db.query(
        "SELECT ID, DESCRIPCION, TIPO_VENTA, PRECIO FROM PLU WHERE ID!=99998 AND ID!=99999",
        [],
        (err, res) => {
          db.detach();
          if (err) throw err;
          res.forEach(item => {
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

export function clearSales() {
  return new Promise(resolve => {
    fb.attach({ ...options, database: "C:/projects/qendra.fdb" }, (err, db) => {
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

export function createSell() {
  return new Promise(resolve => {
    fb.attach({ ...options, database: "C:/projects/qendra.fdb" }, (err, db) => {
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

export function getTotals() {
  return new Promise(resolve => {
    fb.attach({ ...options, database: "C:/projects/qendra.fdb" }, (err, db) => {
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
