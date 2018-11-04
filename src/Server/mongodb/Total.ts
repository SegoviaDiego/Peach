import _ from "lodash";
import Server from "../Server";
import { equalDates, equalSells } from "./Utils";
import { totals as types } from "@/vuexTypes";
import CierreClass from "../typings/Cierre";
import TotalClass from "../typings/Total";
import Product from "./Product";
import Settings from "@/Server/Settings";
import Sell from "./Sell";
import { Collection } from "mongodb";
import Firebird from "../db/Firebird";

export default class Total {
  private static db() {
    return Server.getCollection(types.collection);
  }

  public static listenTo(client: any): void {
    // client.on("load", (data, response) => {});
  }

  public static load(date: Date) {
    return new Promise(async resolve => {
      if (equalDates(new Date(), date)) {
        resolve(await Total.getCurrent());
      } else {
        resolve(await Total.getTotal(date));
      }
    });
  }

  public static identifySells(systelTotal: [any]) {
    Total.getCurrentCierre().then(async (current: any) => {
      let sells: any = [];
      let mutated: boolean = false;

      let currentCierre = _.mapKeys(current.data, total => {
        return total.item._id;
      });

      // Compruebo si se realizo un cierre o no
      // if (Total.checkCierre(systelTotal, currentCierre)) {
      //   await Total.saveCierre();
      // }

      for (const newTotal of systelTotal) {
        let oldTotal = currentCierre[newTotal.item._id];

        currentCierre[newTotal.item._id] = newTotal;

        if (!oldTotal) {
          mutated = true;
          sells.push(
            await Sell.createSellFromTotal(
              {
                amount: 0,
                money: 0
              },
              newTotal
            )
          );
        } else if (!equalSells(oldTotal, newTotal)) {
          mutated = true;
          sells.push(await Sell.createSellFromTotal(oldTotal, newTotal));
        }
      }

      if (mutated) {
        // Firebird.backupDatabaseFile();
        current.data = _.toArray(currentCierre);
        await Sell.saveSystelSells(sells);
        await Total.updateCurrentCierre(current);
      }
    });
  }

  public static checkCierre(systelTotal: any, mongoTotal: any): Boolean {
    if (systelTotal.length == 0 && mongoTotal.length != 0) {
      return true;
    } else {
      systelTotal = _.mapKeys(systelTotal, total => {
        return total.item._id;
      });

      mongoTotal = _.toArray(mongoTotal);

      for (const total of mongoTotal) {
        if (!systelTotal[total.item._id]) {
          return true;
        }
      }
    }
    return false;
  }

  public static addSellsToCierre(sells: any) {
    Total.getCurrentCierre().then(async (current: any) => {
      let oldTotal;

      // Indexo los totales del cierre actual mediante las _id de sus prodctos
      let currentTotals = _.mapKeys(current.data, total => {
        return total.item._id;
      });

      // Creo un total base con money y amount = 0 y sobreescribo lo que se tenga
      // que sobre escribir.
      _.forEach(sells, (sell: any) => {
        oldTotal = {
          amount: 0,
          money: 0,
          ...currentTotals[sell.item._id]
        };

        // Reemplazo el total actual con la suma del viejo mas el nuevo.
        currentTotals[sell.item._id] = {
          item: sell.item,
          amount: oldTotal.amount + sell.amount,
          money: oldTotal.money + sell.money
        };
      });

      // El current indexado lo vuelvo a hacer array para poder
      // Guardarlo en la base de datos.
      current.data = _.toArray(currentTotals);

      // Actualizo la base de datos con la nueva data
      Total.updateCurrentCierre(current);
    });
  }

  public static isEqual(a: any, b: any) {
    if (
      a._id == b._id &&
      parseFloat(a.amount) == parseFloat(b.amount) &&
      parseFloat(a.money) == parseFloat(b.money)
    ) {
      return true;
    }
    return false;
  }

  public static updateTotal(fbTotal: any) {
    return new Promise(async resolve => {
      Total.db().then((db: Collection) => {
        db.replaceOne({ _id: fbTotal._id }, fbTotal, (err: any) => {
          if (err) throw err;
          resolve();
        });
      });

      // .update(
      //   { _id: fbTotal._id },
      //   fbTotal,
      //   (err: any) => {
      //     if (err) throw err;
      //     resolve();
      //   }
      // );
    });
  }

  public static toMap(data: any) {
    const res = new Map();
    for (let index in data) {
      res.set(data[index]._id, data[index]);
    }
    return res;
  }

  public static addTotal(total: any) {
    return new Promise(resolve => {
      Total.getCurrent();
      Total.db().then(db => {
        db.insertOne(total, (err: any, docs: any) => {
          if (err) throw err;
          resolve(docs);
        });
      });
    });
  }

  public static clearTotals() {
    return new Promise(resolve => {
      Total.db().then(db => {
        db.deleteOne({}, err => {
          if (err) throw err;
          resolve();
        });
      });
    });
  }

  public static makeCierre() {
    return new Promise(async resolve => {
      const current: any = await Total.getCurrentCierre();
      if (current.data && current.data.length > 0) {
        Total.saveCierre().then(async () => {
          if (await Settings.isSystelReady()) {
            await Firebird.clearTotales();
          }
          resolve(true);
        });
      } else {
        resolve(false);
      }
    });
  }

  public static saveCierre() {
    return new Promise(async resolve => {
      let currentCierre: any = await Total.getCurrentCierre();

      if (currentCierre.data.length > 0) {
        let current = await Total.getCurrent();

        currentCierre._current = false;
        currentCierre.end = new Date();

        current.cierres[
          _.findIndex(current.cierres, (cierre: any) => {
            return cierre._current;
          })
        ] = currentCierre;

        Total.db().then(db => {
          db.replaceOne({ _current: true }, { ...current }, async () => {
            resolve(await Total.createCurrentCierre());
          });
        });
      } else resolve();
    });
  }

  public static removeCierreStock(data: any) {
    return new Promise(async resolve => {
      for (let item of data) {
        await Product.remove(item._id, item.amount);
      }
      resolve();
    });
  }

  public static getCurrent(): Promise<TotalClass> {
    return new Promise(resolve => {
      Total.db().then(db => {
        db.findOne(
          {
            _current: true
          },
          async (err: any, doc: any) => {
            if (err) throw err;
            resolve(await Total.checkCurrent(doc));
          }
        );
      });
    });
  }

  public static getTotal(date: Date) {
    return new Promise(async resolve => {
      Total.db().then(db => {
        date.setHours(0, 0, 0, 0);

        db.findOne(
          {
            day: date
          },
          async (err, doc) => {
            if (err) throw err;
            resolve(doc);
          }
        );
      });
    });
  }

  public static getCurrentCierre() {
    return new Promise(async resolve => {
      let current = _.find((await Total.getCurrent()).cierres, cierre => {
        return cierre._current;
      });

      resolve(current);
    });
  }

  public static updateCurrent(current: any): Promise<any> {
    return new Promise(async resolve => {
      Total.db().then(db => {
        db.replaceOne({ _current: true }, current, (err: any) => {
          if (err) throw err;
          resolve(true);
        });
      });
    });
  }

  public static updateCurrentCierre(newCierre: any): Promise<any> {
    return new Promise(async resolve => {
      let current = await Total.getCurrent();
      let total = 0;

      for (let i in current.cierres) {
        if (!current.cierres[i]._current) {
          total += current.cierres[i].total;
        }
      }

      newCierre.total = await Total.getCierreTotal(newCierre);
      total += newCierre.total;

      let currentCierre = _.findKey(current.cierres, cierre => {
        return cierre._current;
      });

      if (currentCierre) current.cierres[currentCierre] = newCierre;
      current.total = total;

      resolve(await Total.updateCurrent(current));
    });
  }

  public static getCierreTotal(cierre: any) {
    return new Promise(async resolve => {
      let total = 0;
      for (let item of cierre.data) {
        total += parseFloat(item.money);
      }
      resolve(total);
    });
  }

  public static checkCurrent(current: any): Promise<TotalClass> {
    return new Promise(async resolve => {
      if (current) {
        if (equalDates(new Date(), current.day)) {
          resolve(current);
        } else {
          await Total.saveCurrent(current);
          resolve(await Total.createCurrent());
        }
      } else {
        resolve(await Total.createCurrent());
      }
    });
  }

  public static createCurrent(): Promise<TotalClass> {
    return new Promise(async resolve => {
      Total.db().then(db => {
        const current = new TotalClass(true, 0, [new CierreClass(true, 0, [])]);
        db.insertOne(current, (err: any) => {
          if (err) throw err;
          resolve(current);
        });
      });
    });
  }

  public static createCurrentCierre() {
    return new Promise(async resolve => {
      let current = await Total.getCurrent();
      let newCierre = new CierreClass(true, 0, []);

      current.cierres.push(newCierre);

      Total.db().then(db => {
        db.replaceOne({ _current: true }, current, err => {
          if (err) throw err;
          resolve(newCierre);
        });
      });
    });
  }

  public static saveCurrent(current: any): Promise<any> {
    return new Promise(async resolve => {
      const currentIndex = _.findIndex(current.cierres, (cierre: any) => {
        return cierre._current;
      });
      current._current = false;
      current.cierres[currentIndex]._current = false;
      current.cierres[currentIndex].end = new Date();

      Total.db().then(db => {
        db.replaceOne({ _id: current._id }, current, (err: any) => {
          if (err) throw err;
          db.deleteOne({ _current: true }, (err: any) => {
            if (err) throw err;
            resolve(true);
          });
        });
      });
    });
  }
}
