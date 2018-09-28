import { logger as dbLog } from "../datastore";
import { log as types } from "../../vuexTypes.js";

export function saveLog(type, payload) {
  return new Promise(async resolve => {
    switch (type) {
      case types.stockCleared:
        await saveTotals(payload);
        break;
      case types.inStock:
        await saveInStock(payload);
        break;
      case types.outStock:
        await saveOutStock(payload);
        break;
    }
    resolve();
  });
}

function saveTotals(totals) {
  return new Promise(resolve => {
    dbLog.insert(
      {
        date: new Date(),
        totals,
        type: types.totals
      },
      err => {
        if (err) throw err;
        resolve();
      }
    );
  });
}

function saveInStock(amount) {
  return new Promise(resolve => {
    dbLog.insert(
      {
        date: new Date(),
        amount,
        type: types.inStock
      },
      err => {
        if (err) throw err;
        resolve();
      }
    );
  });
}

function saveOutStock(amount) {
  return new Promise(resolve => {
    dbLog.insert(
      {
        date: new Date(),
        amount,
        type: types.outStock
      },
      err => {
        if (err) throw err;
        resolve();
      }
    );
  });
}
