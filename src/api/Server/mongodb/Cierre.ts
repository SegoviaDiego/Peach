import _ from "lodash";
import Server from "../Server";
import { Collection, ObjectId } from "mongodb";
import socketEvents from "../../../socketEvents";
import { cierre as types } from "../../../vuexTypes";
import Sell from "./Sell";

export default class Cierre {
  private static db(): Promise<Collection<any>> {
    return new Promise(async resolve => {
      const db = await Server.getCollection(types.collection);
      await db.createIndex({ day: 1 });
      // await db.createIndex({ start: 1 });
      // await db.createIndex({ end: 1 });
      resolve(db);
    });
  }

  public static async get(
    event: string,
    data: any,
    callback: (success: boolean, payload: any) => void
  ) {
    switch (event) {
      case socketEvents.Total.load:
        break;
    }
  }

  public static async set(
    event: string,
    data: any,
    callback: (success: boolean, payload: any) => void
  ) {
    switch (event) {
      case socketEvents.Total.makeCierre:
        break;
    }
  }

  public static getFullCollection() {
    return new Promise((resolve, reject) => {
      Cierre.db().then(db => {
        db.find({}).toArray((err, res) => {
          if (err) throw err;
          resolve(res);
        });
      });
    });
  }

  public static load(_id: any) {
    return new Promise(async (resolve, reject) => {
      Cierre.db().then(db => {
        db.findOne({ _id: new ObjectId(_id) })
          .then(async cierre => {
            if (!cierre || !cierre.day || !cierre.start) resolve({});

            const sellsPayload: any = await Cierre.composeCierreSells({
              day: cierre.day,
              start: cierre.start,
              end: cierre.end || new Date()
            });

            resolve({
              ...cierre,
              ...sellsPayload
            });
          })
          .catch(err => {
            reject();
          });
      });
    });
  }

  public static crearNuevoCierre() {
    return new Promise(async (resolve, reject) => {
      Cierre.db().then(db => {
        const day = new Date();
        const start = new Date();

        day.setHours(0, 0, 0, 0);

        const newCierre = {
          day,
          start,
          canceled: false
        };

        db.insertOne(newCierre, (err: any, res) => {
          if (err) throw err;
          resolve(res.insertedId);
        });
      });
    });
  }

  public static terminarTurno(_id: any, end?: Date) {
    return new Promise(async (resolve, reject) => {
      Cierre.db().then(db => {
        db.updateOne(
          { _id: new ObjectId(_id) },
          {
            $set: {
              end: end || new Date()
            }
          }
        )
          .then(res => {
            resolve();
          })
          .catch(err => {
            reject();
          });
      });
    });
  }

  public static composeCierreSells({ day, start, end }: any) {
    return new Promise(async (resolve, reject) => {
      const totalSells: any = {};
      const sells = _.toArray(await Sell.loadCierreSells({ day, start, end }));

      let sell: any, sellTotal: any;
      let total = 0;
      let subTotal = 0;
      let payDivision = {
        efectivo: 0,
        credito: 0,
        debito: 0,
        recargo: 0
      };

      for (sell of sells) {
        total += sell.total || 0;
        subTotal += sell.subTotal || sell.total || 0;

        if (sell.payDivision) {
          payDivision["efectivo"] += sell.payDivision["efectivo"] || 0;
          payDivision["credito"] += sell.payDivision["credito"] || 0;
          payDivision["recargo"] += sell.payDivision["recargo"] || 0;
          payDivision["debito"] += sell.payDivision["debito"] || 0;
        }

        for (sellTotal of sell["sells"]) {
          if (totalSells[sellTotal.item._id]) {
            totalSells[sellTotal.item._id]["amount"] += sellTotal.amount || 0;
            totalSells[sellTotal.item._id]["money"] += sellTotal.money || 0;
          } else {
            totalSells[sellTotal.item._id] = sellTotal;
          }
        }
      }

      let response: any = {
        total,
        payDivision,
        sells: _.toArray(totalSells)
      };

      if (subTotal != total) response["subTotal"] = subTotal;

      resolve(response);
    });
  }
}
