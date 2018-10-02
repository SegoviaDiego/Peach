import { log as types } from "@/vuexTypes";
import Server from "@/Server/Server";
import { fromMagnitude } from "@/Server/mongodb/Utils";

export default class Log {
  private static db(name: string) {
    return Server.getCollection(name);
  }

  public static save(type: any, payload: any) {
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
      let query;

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

      Log.db(db)
        .find(query)
        .toArray((err: any, docs: any) => {
          if (err) throw err;
          resolve(docs);
        });
    });
  }

  public static getMovs(start: Date, end: number): Promise<any> {
    return new Promise(async (resolve: any) => {
      Log.db(types.movLog)
        .find({
          $gte: {
            start
          },
          $lte: {
            end
          }
        })
        .toArray((err: any, docs: any) => {
          if (err) throw err;
          resolve(docs);
        });
    });
  }

  private static createMov(payload: any) {
    return new Promise(async (resolve: any) => {
      let { desc, money, type } = payload;
      let date = new Date();
      let time = new Date();
      date.setHours(0, 0, 0, 0);

      await Log.db(types.movLog).insertOne({
        date,
        time,
        desc,
        type,
        money
      });

      resolve();
    });
  }

  private static inStock(payload: any) {
    return new Promise(async (resolve: any) => {
      let { amount, magnitude } = payload;
      let date = new Date();
      let time = new Date();
      date.setHours(0, 0, 0, 0);

      for (let id in amount) {
        await Log.db(types.inStock).insertOne({
          date,
          time,
          productId: id,
          amount: fromMagnitude(amount[id], magnitude)
        });
      }
      resolve();
    });
  }

  private static outStock(payload: any) {
    return new Promise(async (resolve: any) => {
      let { amount, type, magnitude } = payload;
      let date = new Date();
      let time = new Date();
      date.setHours(0, 0, 0, 0);

      for (let id in amount) {
        await Log.db(types.outStock).insertOne({
          date,
          time,
          productId: id,
          amount: fromMagnitude(amount[id], magnitude),
          type
        });
      }
      resolve();
    });
  }
}
