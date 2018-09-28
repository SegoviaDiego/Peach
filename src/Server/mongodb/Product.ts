import Server from "@/Server/Server";
import { products as types, log as logTypes } from "@/vuexTypes";
import Firebird from "@/Server/db/Firebird";
import Log from "@/Server/mongodb/Log";

export default class Product {
  private static db() {
    return Server.getCollection(types.collection);
  }

  public static loadProducts() {
    return new Promise((resolve, reject) => {
      Product.db()
        .find({})
        .sort({ _id: 1 })
        .toArray((err, docs) => {
          if (err) {
            reject([]);
            throw err;
          }
          resolve(docs);
        });
    });
  }

  public static syncToSystel(): Promise<any> {
    return new Promise(resolve => {
      Firebird.getProductList().then(async (list: any) => {
        for (let item of list) {
          if (!(await Product.productExists(item._id)))
            await Product.createProduct({ ...item, stock: 0 });
          else
            await Product.modifyProduct(item._id, {
              name: item.name,
              price: item.price,
              type: item.type
            });
        }
        resolve();
      });
    });
  }

  public static productExists(_id: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      Product.db().findOne(
        {
          _id
        },
        (err, doc) => {
          if (err) throw err;
          if (doc) resolve(true);
          else resolve(false);
        }
      );
    });
  }

  public static createProduct(product: any): Promise<any> {
    return new Promise((resolve, reject) => {
      Product.db().insert(
        {
          ...product,
          price: parseFloat(parseFloat(product.price).toFixed(2))
        },
        err => {
          if (err) {
            reject({
              error: err,
              code: 2,
              message: "Ha ocurrido un error inesperado."
            });
            throw err;
          }
          resolve(true);
        }
      );
    });
  }

  public static modifyProduct(_id: any, modifiedProduct: any): Promise<any> {
    return new Promise((resolve, reject) => {
      Product.db().findOne({ _id }, (err, doc) => {
        if (err) throw err;
        Product.db().replaceOne(
          { _id },
          { ...doc, ...modifiedProduct },
          {},
          err => {
            if (err) throw err;
            resolve();
          }
        );
      });
    });
  }

  public static deleteItems(selected: any): Promise<any> {
    return new Promise(async resolve => {
      let keys = Object.keys(selected);
      for (let id of keys) {
        if (selected[id]) await Product.deleteProduct(id);
      }
      resolve();
    });
  }

  public static deleteProduct(_id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      Product.db().remove({ _id }, {}, err => {
        if (err) {
          reject({
            error: err,
            code: 2,
            message: "Ha ocurrido un error inesperado."
          });
          throw err;
        }
        resolve();
      });
    });
  }

  public static inStock(amount: any): Promise<any> {
    return new Promise(async resolve => {
      let keys = Object.keys(amount);
      for (let id of keys) {
        await Product.add(id, amount[id]);
      }
      Log.save(logTypes.inStock, amount).then(() => {
        resolve();
      });
    });
  }

  public static add(_id: any, amount: any): Promise<any> {
    return new Promise(resolve => {
      Product.db().update(
        { _id: parseInt(_id) },
        { $inc: { stock: parseFloat(amount) } },
        {},
        err => {
          resolve();
        }
      );
    });
  }

  public static outStock(amount: any): Promise<any> {
    return new Promise(async resolve => {
      let keys = Object.keys(amount);
      for (let id of keys) {
        await Product.remove(id, amount[id]);
      }
      Log.save(logTypes.outStock, amount).then(() => {
        resolve();
      });
    });
  }

  public static remove(_id: any, amount: any): Promise<any> {
    return new Promise(resolve => {
      Product.db().update(
        { _id: parseInt(_id) },
        { $inc: { stock: -parseFloat(amount) } },
        {},
        err => {
          if (err) throw err;
          resolve();
        }
      );
    });
  }
}
