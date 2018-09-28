import { Total as db, Totals as Totalsdb } from "../datastore";
import { Total, Cierre } from "../models/Total";
import { equalDates } from "./Utils";
import { remove } from "./Product";
import _ from "lodash";

export function load(date) {
  return new Promise(async resolve => {
    if (equalDates(new Date(), date)) resolve(await getCurrent());
    else resolve(await getTotal(date));
  });
}

export function identifySells(systelTotal) {
  getCurrentCierre().then(async current => {
    let currentCierre = _.mapKeys(current.data, item => {
      return item._id;
    });

    _.forEach(systelTotal, newTotal => {
      let oldTotal = currentCierre[newTotal._id];

      if (!oldTotal) {
        current.data.push(newTotal);
      } else if (!_.isEqual(oldTotal, newTotal)) {
        current.data[newTotal._id] = newTotal._id;
      }
    });

    updateCurrentCierre(current);

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

export function isEqual(a, b) {
  if (
    a._id == b._id &&
    parseFloat(a.amount) == parseFloat(b.amount) &&
    parseFloat(a.money) == parseFloat(b.money)
  ) {
    return true;
  }
  return false;
}

export function updateTotal(fbTotal) {
  return new Promise(async resolve => {
    db.update({ _id: fbTotal._id }, fbTotal, err => {
      if (err) throw err;
      resolve();
    });
  });
}

export function toMap(data) {
  const res = new Map();
  for (let index in data) {
    res.set(data[index]._id, data[index]);
  }
  return res;
}

export function addTotal(total) {
  return new Promise(resolve => {
    getCurrent();
    db.insert(total, (err, docs) => {
      if (err) throw err;
      resolve(docs);
    });
  });
}

export function clearTotals() {
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

export async function saveCierre() {
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

export function removeCierreStock(data) {
  return new Promise(async resolve => {
    for (let item of data) {
      await remove(item._id, item.amount);
    }
    resolve();
  });
}

export function getCurrent() {
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

export function getTotal(date) {
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

export function getCurrentCierre() {
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

export function updateCurrent(current) {
  return new Promise(async resolve => {
    db.update({ _current: true }, current, err => {
      if (err) throw err;
      resolve(true);
    });
  });
}

export function updateCurrentCierre(newCierre) {
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

export function getCierreTotal(cierre) {
  return new Promise(async resolve => {
    let total = 0;
    for (let item of cierre.data) {
      total += parseFloat(item.money);
    }
    resolve(total);
  });
}

export function checkCurrent(current) {
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

export function createCurrent() {
  return new Promise(async resolve => {
    db.insert(new Total(true, new Date(), 0, []), (err, current) => {
      if (err) throw err;
      resolve(current);
    });
  });
}

export function createCurrentCierre() {
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

export function saveCurrent(current) {
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
