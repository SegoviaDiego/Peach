import _ from "lodash";
import { Collection } from "mongodb";
import Total from "./Total";
import Server from "../Server";
import Product from "./Product";
import socketEvents from "../../../socketEvents";
import { sell as types } from "../../../vuexTypes";

export default class Sell {
  private static db(): Promise<Collection<any>> {
    return new Promise(async resolve => {
      const db = await Server.getCollection(types.collection);
      await db.createIndex({ day: 1, time: 1 });
      resolve(db);
    });
  }

  public static async get(
    event: string,
    data: any,
    callback: (success: boolean, payload: any) => void
  ) {
    switch (event) {
      case socketEvents.Sell.load:
        Sell.load(new Date(data))
          .then(res => callback(true, res))
          .catch(res => callback(false, res));
        break;
    }
  }

  public static async set(
    event: string,
    data: any,
    callback: (success: boolean, payload: any) => void
  ) {
    switch (event) {
      case socketEvents.Sell.saveSell:
        Sell.saveSell(data.sells, data.payload)
          .then(res => callback(true, res))
          .catch(res => callback(false, res));
        break;
    }
  }

  public static getFullCollection() {
    return new Promise((resolve, reject) => {
      Sell.db().then(db => {
        db.find({}).toArray((err, res) => {
          if (err) throw err;
          resolve(res);
        });
      });
    });
  }

  public static load(day: Date) {
    return new Promise(async (resolve, reject) => {
      day.setHours(0, 0, 0, 0);

      Sell.db().then(db => {
        db.find({ day }).toArray((err, sells) => {
          if (err) {
            resolve({});
            throw err;
          } else {
            resolve(sells);
          }
        });
      });
    });
  }

  public static loadRange(start: Date, end: Date) {
    return new Promise(async (resolve, reject) => {
      Sell.db().then(db => {
        const dStart = new Date(start);
        const dEnd = new Date(end);
        dStart.setHours(0, 0, 0, 0);
        dEnd.setHours(0, 0, 0, 0);

        db.find({
          day: {
            $gte: dStart,
            $lte: dEnd
          },
          time: {
            $gte: start,
            $lte: end
          }
        }).toArray((err, sells) => {
          if (err) {
            resolve([]);
            throw err;
          } else {
            resolve(sells);
          }
        });
      });
    });
  }

  public static loadCierreSells(timedata: any) {
    return new Promise(async (resolve, reject) => {
      Sell.db().then(db => {
        db.find({
          day: timedata.day,
          time: {
            $gte: timedata.start,
            $lte: timedata.end
          }
        }).toArray((err, sells) => {
          if (err) {
            reject();
            throw err;
          } else {
            resolve(sells);
          }
        });
      });
    });
  }

  public static createSellFromTotal(oldTotal: any, newTotal: any) {
    return new Promise(async resolve => {
      resolve({
        item: newTotal.item,
        amount: newTotal.amount - oldTotal.amount,
        money: newTotal.money - oldTotal.money
      });
    });
  }

  public static saveSystelSells(sells: [any]) {
    let total = 0;
    for (let i in sells) total += sells[i].money;
    Sell.saveSell(sells, { total, systel: true });
  }

  public static saveSell(
    sells: any,
    { total, subTotal, payDivision, systel }: any
  ): Promise<Boolean> {
    return new Promise(resolve => {
      Sell.db().then(async (db: Collection) => {
        sells = _.toArray(sells);
        let newSell: any;
        let time = new Date();
        let day = new Date();
        day.setHours(0, 0, 0, 0);

        for (let sell of sells) {
          if (sell.item.composed) {
            for (const composer of sell.item.composition) {
              await Product.remove(
                composer._id,
                sell.amount * composer.equivalencia
              );
            }
          } else {
            await Product.remove(sell.item._id, sell.amount);
          }
        }

        newSell = {
          systel: systel ? true : false,
          day,
          time,
          sells,
          total,
          payDivision
        };

        if (subTotal && total != subTotal) newSell["subTotal"] = subTotal;

        db.insertOne(newSell, (err: any) => {
          if (err) throw err;

          // if (!systel) {
          //   Total.addSellsToCierre(sells).then(() => {
          //     Total.addPayDivisionToCierre(payDivision);
          //   });
          // }

          resolve(true);
        });
      });
    });
  }
}
