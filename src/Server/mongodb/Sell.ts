import _ from "lodash";
import Server from "../Server";
import { equalDates } from "./Utils";
import { sell as types } from "@/vuexTypes";
import CierreClass from "../typings/Cierre";
import TotalClass from "../typings/Total";
import Product from "./Product";
import { Collection } from "mongodb";

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

  public static save(
    sells: any,
    { total, methods, payDivision }: any
  ): Promise<Boolean> {
    return new Promise(resolve => {
      Sell.db().then(async (db: Collection) => {
        let dbSells: any = {};
        let time = new Date();
        let day = new Date();
        day.setHours(0, 0, 0, 0);

        for (let i in sells) {
          dbSells[i] = {
            productId: sells[i].item._id,
            amount: sells[i].amount,
            money: sells[i].money
          };

          await Product.remove(sells[i].item._id, sells[i].amount);
        }

        db.insertOne(
          {
            day,
            time,
            sells: dbSells,
            total,
            methods,
            payDivision
          },
          (err: any) => {
            if (err) throw err;
            resolve(true);
          }
        );
      });
    });
  }
}
