import { log as types } from "../../../vuexTypes";
import Server from "../Server";
import { fromMagnitude } from "../../Utils";
import socketEvents from "../../../socketEvents";

export default class Log {
  private static db(name: string) {
    return Server.getCollection(name);
  }

  public static async get(
    event: string,
    data: any,
    callback: (success: boolean, payload: any) => void
  ) {
    switch (event) {
      case socketEvents.Log.getLog:
        Log.getLog(data.db, new Date(data.date), data.type || null)
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
      case socketEvents.Log.saveLog:
        Log.saveLog(data.type, data.payload)
          .then(res => callback(true, res))
          .catch(res => callback(false, res));
        break;
    }
  }

  public static saveLog(type: any, payload: any) {
    return new Promise(async resolve => {
      switch (type) {
        case types.inStock:
          resolve(await Log.inStock(payload));
          break;
        case types.outStock:
          resolve(await Log.outStock(payload));
          break;
        case types.createMov:
          resolve(await Log.createMov(payload));
          break;
        default:
          resolve();
          break;
      }
    });
  }

  public static getLog(db: string, date: Date, type?: number): Promise<any> {
    return new Promise(async (resolve: any) => {
      date.setHours(0, 0, 0, 0);
      let query: any;

      if (type && type != 4) {
        query = {
          date,
          type
        };
      } else {
        query = {
          date
        };
      }

      Log.db(db).then(db => {
        db.find(query).toArray((err: any, docs: any) => {
          if (err) throw err;
          resolve(docs);
        });
      });
    });
  }

  public static getMovs(start: Date, end: number): Promise<any> {
    return new Promise(async (resolve: any) => {
      Log.db(types.movLog).then(db => {
        db.find({
          $gte: {
            start
          },
          $lte: {
            end
          }
        }).toArray((err: any, docs: any) => {
          if (err) throw err;
          resolve(docs);
        });
      });
    });
  }

  private static createMov(payload: any) {
    return new Promise(async (resolve: any) => {
      let { desc, money, type } = payload;
      let date = new Date();
      let time = new Date();
      date.setHours(0, 0, 0, 0);

      Log.db(types.movLog).then(db => {
        db.insertOne({
          date,
          time,
          desc,
          type,
          money
        }).then(() => {
          resolve();
        });
      });
    });
  }

  private static inStock(inputs: any) {
    return new Promise(async (resolve: any) => {
      let date = new Date();
      let time = new Date();
      date.setHours(0, 0, 0, 0);

      Log.db(types.inStock).then(db => {
        for (let i in inputs) {
          db.insertOne({
            date,
            time,
            item: inputs[i].item,
            amount: fromMagnitude(inputs[i].input, inputs[i].item.type)
          });
          resolve();
        }
      });
    });
  }

  private static outStock({ inputs, type }: any) {
    return new Promise(async (resolve: any) => {
      let date = new Date();
      let time = new Date();
      date.setHours(0, 0, 0, 0);

      Log.db(types.outStock).then(db => {
        for (let i in inputs) {
          db.insertOne({
            date,
            time,
            item: inputs[i].item,
            amount: fromMagnitude(inputs[i].input, inputs[i].item.type),
            type
          });
          resolve();
        }
      });
    });
  }
}
