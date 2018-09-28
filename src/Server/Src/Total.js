// import { Total as db, Totals as Totalsdb } from "../datastore";
// import { Total, Cierre } from "../models/Total";
import { equalDates } from "./Utils";
// import { remove } from "./Product";
import _ from "lodash";

export default class Total {
  public static load(date: Date) {
    return new Promise(async resolve => {
      if (equalDates(new Date(), date)) resolve(await Total.getCurrent());
      else resolve(await Total.getTotal(date));
    });
  }

  public static identifySells(systelTotal: []) {
    Total.getCurrentCierre().then(async (current: any) => {
      let currentCierre = _.mapKeys(current.data, item => {
        return item._id;
      });

      _.forEach(systelTotal, (newTotal: any) => {
        let oldTotal = currentCierre[newTotal._id];

        if (!oldTotal) {
          current.data.push(newTotal);
        } else if (!_.isEqual(oldTotal, newTotal)) {
          current.data[newTotal._id] = newTotal._id;
        }
      });

      Total.updateCurrentCierre(current);

      // await systelTotal.forEach(async (newTotal, id) => {
      //   let oldTotal = currentCierre.get(id);
      //   if (!oldTotal) {
      //     await addTotal(newTotal);
      //     // await identifySell(
      //     //   {
      //     //     money: 0,
      //     //     amount: 0
      //     //   },
      //     //   newTotal
      //     // );
      //   } else if (!isEqual(oldTotal, newTotal)) {
      //     console.log(2);
      //     await identifySell(oldTotal, newTotal);
      //     await updateTotal(newTotal);
      //   }
      // });
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
      db.update({ _id: fbTotal._id }, fbTotal, (err: any) => {
        if (err) throw err;
        resolve();
      });
    });
  }

  public static toMap(data) {
    const res = new Map();
    for (let index in data) {
      res.set(data[index]._id, data[index]);
    }
    return res;
  }

  public static addTotal(total) {
    return new Promise(resolve => {
      getCurrent();
      db.insert(total, (err, docs) => {
        if (err) throw err;
        resolve(docs);
      });
    });
  }

  public static clearTotals() {
    return new Promise(resolve => {
      db.remove(
        {},
        {
          multi: true
        },
        err => {
          if (err) throw err;
          resolve();
        }
      );
    });
  }

  public static saveCierre() {
    return new Promise(async resolve => {
      let currentCierre = await getCurrentCierre();

      if (currentCierre.data.length > 0) {
        let current = await getCurrent();
        currentCierre._current = false;
        currentCierre.date = new Date();

        await removeCierreStock(currentCierre.data);

        current.cierres[
          _.findIndex(current.cierres, cierre => {
            return cierre._current;
          })
        ] = currentCierre;

        db.update({ _current: true }, { ...current }, async () => {
          resolve(await createCurrentCierre());
        });
      } else resolve();
    });
  }

  public static removeCierreStock(data) {
    return new Promise(async resolve => {
      for (let item of data) {
        await remove(item._id, item.amount);
      }
      resolve();
    });
  }

  public static getCurrent() {
    return new Promise(resolve => {
      db.findOne(
        {
          _current: true
        },
        async (err, doc) => {
          if (err) throw err;
          resolve(await checkCurrent(doc));
        }
      );
    });
  }

  public static getTotal(date) {
    return new Promise(async resolve => {
      Totalsdb.findOne(
        {
          $where: function() {
            return equalDates(date, this.date);
          }
        },
        async (err, doc) => {
          if (err) throw err;
          resolve(doc);
        }
      );
    });
  }

  public static getCurrentCierre() {
    return new Promise(async resolve => {
      let current = _.find((await getCurrent()).cierres, cierre => {
        return cierre._current;
      });

      if (current) {
        resolve(current);
      } else {
        resolve(await createCurrentCierre());
      }
    });
  }

  public static updateCurrent(current) {
    return new Promise(async resolve => {
      db.update({ _current: true }, current, err => {
        if (err) throw err;
        resolve(true);
      });
    });
  }

  public static updateCurrentCierre(newCierre) {
    return new Promise(async resolve => {
      let current = await getCurrent();
      let total = 0;

      for (let i in current.cierres) {
        if (!current.cierres[i]._current) {
          total += current.cierres[i].total;
        }
      }

      newCierre.total = await getCierreTotal(newCierre);
      total += newCierre.total;

      let currentCierre = _.findKey(current.cierres, cierre => {
        return cierre._current;
      });

      current.cierres[currentCierre] = newCierre;
      current.total = total;

      resolve(await updateCurrent(current));
    });
  }

  public static getCierreTotal(cierre) {
    return new Promise(async resolve => {
      let total = 0;
      for (let item of cierre.data) {
        total += parseFloat(item.money);
      }
      resolve(total);
    });
  }

  public static checkCurrent(current) {
    return new Promise(async resolve => {
      if (current) {
        if (equalDates(new Date(), current.date)) {
          resolve(current);
        } else {
          await saveCurrent(current);
          resolve(await createCurrent());
        }
      } else {
        resolve(await createCurrent());
      }
    });
  }

  public static createCurrent() {
    return new Promise(async resolve => {
      db.insert(new Total(true, new Date(), 0, []), (err, current) => {
        if (err) throw err;
        resolve(current);
      });
    });
  }

  public static createCurrentCierre() {
    return new Promise(async resolve => {
      let current = await getCurrent();
      let newCierre = new Cierre(true, new Date(), 0, []);

      current.cierres.push(newCierre);

      db.update({ _current: true }, current, err => {
        if (err) throw err;
        resolve(newCierre);
      });
    });
  }

  public static saveCurrent(current) {
    return new Promise(async resolve => {
      current._current = false;
      Totalsdb.insert(current, err => {
        if (err) throw err;
        db.remove({ _current: true }, err => {
          if (err) throw err;
          resolve(true);
        });
      });
    });
  }
}
