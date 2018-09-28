import { sells as db } from "../datastore";
import { remove } from "./Product";

export function identifySell(dbTotal, fbTotal) {
  return new Promise(resolve => {
    createSell({
      _id: undefined,
      _productId: fbTotal._id,
      amount: fbTotal.amount - dbTotal.amount,
      money: fbTotal.money - dbTotal.money,
      date: new Date()
    }).then(sell => {
      remove(sell._productId, sell.amount).then(() => resolve());
    });
  });
}

export function createSell(sell) {
  return new Promise(resolve => {
    db.insert(sell, (err, s) => {
      if (err) throw err;
      resolve(s);
    });
  });
}

export function loadSells(date) {
  return new Promise(resolve => {
    db.find(
      {
        $where: function() {
          return (
            this.date.getFullYear() == date.getFullYear() &&
            this.date.getMonth() == date.getMonth() &&
            this.date.getDate() == date.getDate()
          );
        }
      },
      (err, sells) => {
        if (err) throw err;
        resolve(sells);
      }
    );
  });
}

// export function LOAD_SELLS(callback) {
//   const Sell = Sequelize.con().import("../Models/Sell");
//   Sell.findAll()
//     .then(sell => {
//       if (!sell || sell.length <= 0)
//         response({
//           payload: {
//             sells: []
//           }
//         });
//       else
//         callback({
//           payload: {
//             sells: {
//               ...sell,
//               money: parseFloat(sell.money),
//               amount: parseFloat(sell.amount)
//             }
//           }
//         });
//     })
//     .catch(error => {
//       callback({
//         error: {
//           error: error,
//           code: 2,
//           message: "Ha ocurrido un error inesperado."
//         }
//       });
//     });
// }

// export function CREATE_SELL(sell, callback) {
//   const Sell = Sequelize.con().import("../Models/Sell");
//   const Product = Sequelize.con().import("../Models/Product");
//   Product.findById(sell.ProductId).then(p => {
//     if (!p) {
//       callback();
//     } else {
//       Sell.create({ ...sell, date: new Date().toString() })
//         .then(s => {
//           if (!s) {
//             callback({
//               error: {
//                 code: 0,
//                 message: "No se ha podido crear el producto."
//               }
//             });
//           } else {
//             callback({
//               payload: {
//                 sell: s
//               }
//             });
//           }
//         })
//         .catch(error => {
//           callback({
//             error: {
//               error: error,
//               code: 2,
//               message: "Ha ocurrido un error inesperado."
//             }
//           });
//         });
//     }
//   });
// }
