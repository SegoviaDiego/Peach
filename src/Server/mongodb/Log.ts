import { log as types } from "@/vuexTypes";
import Server from "@/Server/Server";

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
        default:
          resolve();
          break;
      }
    });
  }

  private static inStock(amount: any) {
    return new Promise(resolve => {
      Log.db(types.inStock).insert(
        {
          date: new Date(),
          amount
        },
        err => {
          if (err) throw err;
          resolve();
        }
      );
    });
  }

  private static outStock(amount: any) {
    return new Promise(resolve => {
      Log.db(types.outStock).insert(
        {
          date: new Date(),
          amount
        },
        err => {
          if (err) throw err;
          resolve();
        }
      );
    });
  }
}
