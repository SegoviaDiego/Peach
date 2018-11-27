import _ from "lodash";
import { Collection } from "mongodb";
import Total from "./Total";
import Server from "../Server";
import Product from "./Product";
import socketEvents from "../../../socketEvents";
import { sell as types } from "../../../vuexTypes";

export default class Sell {
  private static db() {
    return Server.getCollection(types.collection);
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

  public static load(date: Date) {
    return new Promise(async (resolve, reject) => {
      date.setHours(0, 0, 0, 0);

      Sell.db().then(db => {
        db.find({ day: date }).toArray((err, sells) => {
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
    { total, payDivision, systel }: any
  ): Promise<Boolean> {
    return new Promise(resolve => {
      Sell.db().then(async (db: Collection) => {
        sells = _.toArray(sells);
        let time = new Date();
        let day = new Date();
        day.setHours(0, 0, 0, 0);

        for (let sell of sells) {
          await Product.remove(sell.item._id, sell.amount);
        }

        db.insertOne(
          {
            systel: systel ? true : false,
            day,
            time,
            sells,
            total,
            payDivision
          },
          (err: any) => {
            if (err) throw err;

            if (!systel) {
              Total.addSellsToCierre(sells).then(() => {
                Total.addPayDivisionToCierre(payDivision);
              });
            }

            resolve(true);
          }
        );
      });
    });
  }
}
