import _ from "lodash";
import Server from "../Server";
import { equalDates } from "./Utils";
import { sell as types } from "@/vuexTypes";
import CierreClass from "../typings/Cierre";
import TotalClass from "../typings/Total";
import Product from "./Product";
import { toMagnitude } from "./Utils";
import { Collection } from "mongodb";
import Total from "@/Server/mongodb/Total";

export default class Sell {
  private static db() {
    return Server.getCollection(types.collection);
  }

  public static load(date: Date) {
    // return new Promise(async resolve => {
    //   if (equalDates(new Date(), date)) {
    //     resolve(await Total.getCurrent());
    //   } else {
    //     resolve(await Total.getTotal(date));
    //   }
    // });
  }

  public static createSellFromTotal(oldTotal: any, newTotal: any) {
    return {
      item: {
        _id: newTotal._id
      },
      amount: newTotal.amount - oldTotal.amount,
      money: newTotal.money - oldTotal.money
    };
  }

  public static saveSystelSells(sells: [any]) {
    let total = 0;
    for (let i in sells) total += sells[i].money;
    Sell.save(sells, { total, systel: true });
  }

  public static save(
    sells: any,
    { total, methods, payDivision, systel }: any
  ): Promise<Boolean> {
    return new Promise(resolve => {
      Sell.db().then(async (db: Collection) => {
        let dbSells: any = [];
        let time = new Date();
        let day = new Date();
        day.setHours(0, 0, 0, 0);

        for (let sell of _.toArray(sells)) {
          dbSells.push({
            productId: sell.item._id,
            amount: sell.amount,
            money: sell.money
          });

          await Product.remove(sell.item._id, sell.amount);
        }

        db.insertOne(
          {
            systel: systel ? true : false,
            day,
            time,
            sells: dbSells,
            total,
            methods,
            payDivision
          },
          (err: any) => {
            if (err) throw err;

            if (!systel) Total.addSellsToCierre(dbSells);

            resolve(true);
          }
        );
      });
    });
  }
}
