import _ from "lodash";
import Server from "../Server";
import { Collection, ObjectId } from "mongodb";
import Sell from "./Sell";
import Cierre from "./Cierre";
import Settings from "../Settings";
import Firebird from "../db/Firebird";
import { equalDates, equalSells, validateInt } from "../../Utils";
import socketEvents from "../../../socketEvents";
import { totals as types } from "../../../vuexTypes";

export default class Total {
  private static db(): Promise<Collection<any>> {
    return new Promise(async resolve => {
      const db = await Server.getCollection(types.collection);
      await db.createIndex({ day: 1 }, { unique: true });
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
        Total.load(new Date(data))
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
      case socketEvents.Total.makeCierre:
        Total.crearCierreDeTurno()
          .then(res => callback(true, res))
          .catch(res => callback(false, res));
        break;
    }
  }

  public static getDefault(day: Date) {
    return {
      day,
      total: 0,
      cierres: [],
      cierresData: [],
      payDivision: {}
    };
  }

  public static load(date: Date) {
    return new Promise(async resolve => {
      const total = await Total.getTotal(date);

      resolve({
        ...total,
        ...(await Total.getCierres(total))
      });
    });
  }

  public static getTotal(day: Date) {
    return new Promise(async resolve => {
      Total.db().then(db => {
        day.setHours(0, 0, 0, 0);

        db.findOne({ day }, async (err, total) => {
          if (err) throw err;
          if (equalDates(new Date(), day)) {
            resolve(await Total.checkTodaysTotal(total));
          } else {
            if (!total) {
              resolve(Total.getDefault(day));
            }
            resolve(total);
          }
        });
      });
    });
  }

  public static checkTodaysTotal(total: any) {
    return new Promise(async resolve => {
      if (total) {
        resolve(total);
      } else {
        resolve(await Total.createTodaysTotal());
      }
    });
  }

  public static createTodaysTotal() {
    return new Promise(async resolve => {
      Total.db().then(async db => {
        const day = new Date();
        day.setHours(0, 0, 0, 0);
        const _turnoActual = await Cierre.crearNuevoCierre();

        // Cerrar el ultimo turno del dia anterior
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdaysTotal: any = await Total.getTotal(yesterday);
        await Cierre.terminarTurno(yesterdaysTotal._turnoActual, day);

        const todaysTotal = {
          day,
          _turnoActual,
          cierres: [_turnoActual]
        };

        db.insertOne(todaysTotal, (err: any) => {
          if (err) throw err;
          resolve(todaysTotal);
        });
      });
    });
  }

  public static getCierres(totalDelDia: any) {
    return new Promise(async (resolve, reject) => {
      if (totalDelDia && totalDelDia.cierres) {
        const cierresData = [];
        let cierre: any;
        let total = 0;
        let subTotal = 0;
        let payDivision = {
          efectivo: 0,
          credito: 0,
          debito: 0,
          recargo: 0
        };

        for (const _id of totalDelDia.cierres) {
          cierre = await Cierre.load(_id);

          total += cierre.total;
          subTotal += cierre.subTotal || cierre.total;
          payDivision["efectivo"] += cierre.payDivision["efectivo"] || 0;
          payDivision["credito"] += cierre.payDivision["credito"] || 0;
          payDivision["recargo"] += cierre.payDivision["recargo"] || 0;
          payDivision["debito"] += cierre.payDivision["debito"] || 0;

          cierresData.push(cierre);
        }

        let response: any = {
          total,
          cierresData,
          payDivision
        };

        if (subTotal != total) response["subTotal"] = subTotal;

        resolve(response);
      } else {
        resolve([]);
      }
    });
  }

  public static getCierreDeTurnoActual() {
    return new Promise(async (resolve, reject) => {
      const total: any = await Total.getTotal(new Date());
      resolve(await Cierre.load(total._turnoActual));
    });
  }

  public static crearCierreDeTurno() {
    return new Promise(async (resolve, reject) => {
      const cierreDeTurnoActual: any = await Total.getCierreDeTurnoActual();
      // Si el cierre actual tiene ventas, realizo un cierre.
      // Si esta vacio significa que el cierre ya fue realizado.

      if (cierreDeTurnoActual.sells && cierreDeTurnoActual.sells.length > 0) {
        // Si la sync con Systel esta activada
        const isSystelReady: Boolean = await Settings.isSystelReady();
        // Si QENDRA esta cerrado
        const isFirebirdAvailable: Boolean = await Firebird.isFirebirdAvailable();

        if (isSystelReady && isFirebirdAvailable) {
          // Detengo el loop de sincronizacion
          Firebird.stopSystelSyncProcess();
        } else if (isSystelReady) {
          // Devuelvo un error diciendo que QENDRA esta abierto
          reject(true);
          return;
        }

        // Guardo el cierre en la base de datos
        // O sea, cambio la _CurrenId del todaysTotal a una nueva
        // O sea, creo un nuevo cierre y lo sustituyo.
        await Total.crearCierreDeTurnoActual();

        if (isSystelReady && isFirebirdAvailable) {
          // Si sync con Systel esta activado, reanudo el loop sync
          // y borro los datos en los totales
          await Firebird.clearTotales();
          // Inicio el loop de sincronizacion.
          Firebird.startSystelSyncProcess();
        }
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }

  public static crearCierreDeTurnoActual() {
    return new Promise((resolve, reject) => {
      Total.db().then(async db => {
        const total: any = await Total.getTotal(new Date());
        const _turnoActual = await Cierre.crearNuevoCierre();

        await Cierre.terminarTurno(total._turnoActual);

        total.cierres.push(_turnoActual);
        total._turnoActual = _turnoActual;

        db.replaceOne({ _id: new ObjectId(total._id) }, total, (err, res) => {
          if (err) throw err;
          resolve();
        });
      });
    });
  }

  // Systel

  public static analyzeSystelUpdate(systelTotal: any) {
    return new Promise(async (resolve, reject) => {
      Total.getCierreDeTurnoActual().then(async (cierre: any) => {
        // Compruebo si son el mismo turno,
        // si no lo son se debe realizar un cierre
        if (!Total.sonElMismoTurno(systelTotal, cierre)) {
          await this.crearCierreDeTurno();
        }
        // Guardo los datos del total si systelTotal no esta vacio
        if (systelTotal.length) await Total.identifySells(systelTotal);
        resolve();
      });
    });
  }

  public static sonElMismoTurno(systelSells: any, cierre: any): Boolean {
    // Si systelTotal esta vacio, significa que se hizo un cierre
    // en la balanza y no son los mismos Turnos
    if (systelSells.length == 0) {
      return false;
    } else {
      const sells = _.toArray(cierre.sells);
      systelSells = _.mapKeys(systelSells, total => {
        return total.item._id;
      });

      // Compruebo que sean el mismo Turno. Esto lo se sabiendo que
      // el turno actual esta incluido estrictamente en systelTotal
      for (const sell of sells) {
        // Si un elemento de el Turno actual no existe en systelTotal,
        // no existe inclusion de conjuntos y por lo tanto son distintos Turnos.
        if (!systelSells[sell.item._id]) {
          return false;
        }
      }
    }
    return true;
  }

  public static identifySells(systelTotal: [any]) {
    return new Promise(resolve => {
      Total.getCierreDeTurnoActual().then(async (turnoActual: any) => {
        let turnoSell;
        let systelSells: any = [];
        let mutated: boolean = false;
        const turnoSells = _.mapKeys(turnoActual.sells, sell => {
          return sell.item._id;
        });

        for (const systelSell of systelTotal) {
          turnoSell = turnoSells[systelSell.item._id];

          if (!turnoSell) {
            mutated = true;
            systelSells.push(
              await Sell.createSellFromTotal(
                {
                  amount: 0,
                  money: 0
                },
                systelSell
              )
            );
          } else if (!equalSells(turnoSell, systelSell)) {
            mutated = true;
            systelSells.push(
              await Sell.createSellFromTotal(turnoSell, systelSell)
            );
          }
        }

        if (mutated) {
          // Firebird.backupDatabaseFile();
          await Sell.saveSystelSells(systelSells);
        }
        resolve();
      });
    });
  }
}
