import _ from "lodash";
import Sell from "./mongodb/Sell";
import Log from "./mongodb/Log";
import socketEvents from "../../socketEvents";

export default class Chart {
  public static async get(
    event: string,
    data: any,
    callback: (success: boolean, payload: any) => void
  ) {
    switch (event) {
      case socketEvents.Chart.topProducts:
        Chart.topProducts(data)
          .then(res => callback(true, res))
          .catch(res => callback(false, res));
        break;
      case socketEvents.Chart.general:
        Chart.general(data.start, data.end)
          .then(res => callback(true, res))
          .catch(res => callback(false, res));
        break;
      case socketEvents.Chart.dailySell:
        Chart.dailySell(data)
          .then(res => callback(true, res))
          .catch(res => callback(false, res));
        break;
      case socketEvents.Chart.monthlySell:
        Chart.monthlySell(data)
          .then(res => callback(true, res))
          .catch(res => callback(false, res));
        break;
    }
  }

  public static dailySell({ start, end }: any) {
    return new Promise(async (resolve, reject) => {
      start = new Date(start);
      end = new Date(end);

      let sell: any;
      const sells = await Sell.loadRange(start, end);

      const res: any = [
        { name: "Domingo", money: 0 },
        { name: "Lunes", money: 0 },
        { name: "Martes", money: 0 },
        { name: "Miercoles", money: 0 },
        { name: "Jueves", money: 0 },
        { name: "Viernes", money: 0 },
        { name: "Sabado", money: 0 }
      ];

      for (sell of _.toArray(sells)) {
        res[sell.day.getDay()].money += sell.total;
      }

      resolve(res);
    });
  }

  public static monthlySell({ start, end }: any) {
    return new Promise(async (resolve, reject) => {
      start = new Date(start);
      end = new Date(end);

      let sell: any;
      const sells = await Sell.loadRange(start, end);

      const res: any = [
        { name: "Enero", money: 0 },
        { name: "Febrero", money: 0 },
        { name: "Marzo", money: 0 },
        { name: "Abril", money: 0 },
        { name: "Mayo", money: 0 },
        { name: "Junio", money: 0 },
        { name: "Julio", money: 0 },
        { name: "Agosto", money: 0 },
        { name: "Septiembre", money: 0 },
        { name: "Octubre", money: 0 },
        { name: "Noviembre", money: 0 },
        { name: "Diciembre", money: 0 }
      ];

      for (sell of _.toArray(sells)) {
        res[sell.day.getMonth()].money += sell.total;
      }

      resolve(res);
    });
  }

  public static topProducts({ start, end }: any) {
    return new Promise(async (resolve, reject) => {
      let sell: any;
      let product: any;
      start = new Date(start);
      end = new Date(end);

      const sells = await Sell.loadRange(start, end);
      const res: any = {};

      for (sell of _.toArray(sells)) {
        for (product of _.toArray(sell.sells)) {
          if (res[product.item._id]) {
            res[product.item._id]["amount"] += product.amount;
            res[product.item._id]["money"] += product.money;
          } else {
            res[product.item._id] = product;
          }
        }
      }

      resolve(_.toArray(res));
    });
  }

  public static general(start: Date, end: Date) {
    return new Promise(async (resolve, reject) => {
      start = new Date(start);
      end = new Date(end);
      const res: any = {
        venta: {
          money: 0,
          name: "Ventas"
        },
        recargo: {
          money: 0,
          name: "Recargo de ventas por credito"
        },
        ingresos: {
          money: 0,
          name: "Movimientos de Ingreso"
        },
        egreso: {
          money: 0,
          name: "Movimientos de Egreso"
        },
        egresoProducto: {
          money: 0,
          name: "Egreso de productos"
        }
      };

      const sells = await Sell.loadRange(start, end);

      let sell: any;

      for (sell of _.toArray(sells)) {
        if (sell.subTotal) {
          res.venta.money += sell.subTotal;
          res.recargo.money += sell.total - sell.subTotal;
        } else {
          res.venta.money += sell.total;
        }
      }

      Log;

      resolve(res);
    });
  }
}
