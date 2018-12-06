import Log from "./Log";
import Server from "../Server";
import Firebird from "../db/Firebird";
import { fromMagnitude } from "../../Utils";
import socketEvents from "../../../socketEvents";
import { products as types, log as logTypes } from "../../../vuexTypes";
// import Firebase from "../db/Firebase";

export default class Product {
  private static db() {
    return Server.getCollection(types.collection);
  }

  public static async get(
    event: string,
    data: any,
    callback: (success: boolean, payload: any) => void
  ) {
    switch (event) {
      case socketEvents.Product.loadProducts:
        Product.loadProducts()
          .then(res => callback(true, res))
          .catch(res => callback(false, res));
        break;
      case socketEvents.Product.productExists:
        Product.productExists(data)
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
      case socketEvents.Product.syncToSystel:
        Product.syncToSystel()
          .then(res => callback(true, res))
          .catch(res => callback(false, res));
        break;
      case socketEvents.Product.createProduct:
        Product.createProduct(data)
          .then(res => callback(true, res))
          .catch(res => callback(false, res));
        break;
      case socketEvents.Product.mutateProducts:
        Product.mutateProducts(data)
          .then(res => callback(true, res))
          .catch(res => callback(false, res));
        break;
      case socketEvents.Product.composeProduct:
        Product.composeProduct(data)
          .then(res => callback(true, res))
          .catch(res => callback(false, res));
        break;
      case socketEvents.Product.deleteProducts:
        Product.deleteProducts(data)
          .then(res => callback(true, res))
          .catch(res => callback(false, res));
        break;
      case socketEvents.Product.inStock:
        Product.inStock(data)
          .then(res => callback(true, res))
          .catch(res => callback(false, res));
        break;
      case socketEvents.Product.outStock:
        Product.outStock(data.outs, data.type)
          .then(res => callback(true, res))
          .catch(res => callback(false, res));
        break;
    }
  }

  public static getFullCollection() {
    return new Promise((resolve, reject) => {
      Product.db().then(db => {
        db.find({}).toArray((err, res) => {
          if (err) throw err;
          resolve(res);
        });
      });
    });
  }

  public static getProduct(_id: any) {
    return new Promise((resolve, reject) => {
      Product.db().then(db => {
        db.findOne(
          {
            _id
          },
          (err, doc) => {
            if (err) throw err;
            resolve(doc);
          }
        );
      });
    });
  }

  public static loadProducts() {
    return new Promise((resolve, reject) => {
      Product.db()
        .then(db => {
          db.find({})
            .sort({ _id: 1 })
            .toArray((err, docs) => {
              if (err) {
                reject();
                throw err;
              }
              resolve(docs);
            });
        })
        .catch(reject);
    });
  }

  public static syncToSystel(): Promise<any> {
    return new Promise(resolve => {
      Firebird.getProductList().then(async (list: any) => {
        for (let item of list) {
          if (!(await Product.productExists(item._id))) {
            await Product.createProduct({ ...item, stock: 0 });
          } else {
            await Product.mutateProduct(item._id, {
              name: item.name,
              price: item.price,
              type: item.type
            });
          }
        }
        resolve();
      });
    });
  }

  public static productExists(_id: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      Product.db().then(db => {
        db.findOne(
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
    });
  }

  public static createProduct(product: any): Promise<any> {
    return new Promise((resolve, reject) => {
      Product.db()
        .then(db => {
          db.insertOne(
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
              } else {
                // Firebase.saveProduct({
                //   ...product,
                //   price: parseFloat(parseFloat(product.price).toFixed(2))
                // });
                resolve(true);
              }
            }
          );
        })
        .catch(reject);
    });
  }

  public static composeProduct({ _id, composition }: any) {
    return new Promise(async resolve => {
      Product.db().then(db => {
        db.updateOne(
          { _id },
          {
            $set: {
              composition,
              composed: true
            }
          },
          {},
          err => {
            if (err) throw err;
            else {
              // Firebase.saveProduct({ ...doc, ...modifiedProduct });
              resolve();
            }
          }
        );
      });
    });
  }

  public static mutateProducts(mutations: any) {
    return new Promise(async resolve => {
      let keys = Object.keys(mutations);
      for (let id of keys) {
        if (mutations[id]) await Product.mutateProduct(id, mutations[id]);
      }
      resolve();
    });
  }

  public static mutateProduct(_id: any, modifiedProduct: any): Promise<any> {
    return new Promise((resolve, reject) => {
      Product.db().then(db => {
        db.findOne({ _id }, (err, doc) => {
          if (err) throw err;
          db.replaceOne(
            { _id },
            {
              ...doc,
              ...modifiedProduct,
              price: parseFloat(modifiedProduct.price)
            },
            {},
            err => {
              if (err) throw err;
              else {
                // Firebase.saveProduct({ ...doc, ...modifiedProduct });
                resolve();
              }
            }
          );
        });
      });
    });
  }

  public static deleteProducts(selected: any): Promise<any> {
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
      Product.db().then(db => {
        db.deleteOne({ _id }, {}, err => {
          if (err) {
            reject({
              error: err,
              code: 2,
              message: "Ha ocurrido un error inesperado."
            });
            throw err;
          } else {
            // Firebase.deleteProduct({ _id });
            resolve();
          }
        });
      });
    });
  }

  public static inStock(inputs: any): Promise<any> {
    return new Promise(async resolve => {
      for (let i in inputs) {
        if (inputs[i])
          if (inputs[i].input > 0)
            await Product.add(
              inputs[i].item._id,
              fromMagnitude(inputs[i].input, inputs[i].item.type)
            );
      }
      Log.saveLog(logTypes.inStock, inputs).then(() => {
        resolve();
      });
    });
  }

  public static add(_id: any, amount: any): Promise<any> {
    return new Promise(resolve => {
      Product.db().then(db => {
        db.updateOne(
          { _id },
          { $inc: { stock: parseFloat(amount) } },
          {},
          (err, res) => {
            resolve();
          }
        );
      });
    });
  }

  public static outStock(inputs: any, type: any): Promise<any> {
    return new Promise(async resolve => {
      for (let i in inputs) {
        if (inputs[i])
          if (inputs[i].input > 0)
            await Product.remove(
              inputs[i].item._id,
              fromMagnitude(inputs[i].input, inputs[i].item.type)
            );
      }
      Log.saveLog(logTypes.outStock, { inputs, type }).then(() => {
        resolve();
      });
    });
  }

  public static remove(_id: any, amount: any): Promise<any> {
    return new Promise(resolve => {
      Product.db().then(db => {
        db.updateOne(
          { _id },
          { $inc: { stock: -parseFloat(amount) } },
          {},
          err => {
            if (err) throw err;
            resolve();
          }
        );
      });
    });
  }
}
