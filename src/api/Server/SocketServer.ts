import express from "express";
import io from "socket.io";

import Server from "./Server";
import Product from "./mongodb/Product";
import Total from "./mongodb/Total";
import Sell from "./mongodb/Sell";
import Log from "./mongodb/Log";
import Firebird from "./db/Firebird";

export default class SocketServer {
  private static server: io.Server;

  public static start() {
    return new Promise(async (resolve, reject) => {
      if (!SocketServer.server) {
        // Run server on port 3037
        const app = await express();
        const server = await app.listen(3037);
        SocketServer.server = await io.listen(server, { serveClient: false });

        // Sync server
        await Server.initServer();

        // Listen clients
        SocketServer.server.on("connection", (socket: io.Socket) => {
          SocketServer.listen(socket);
        });

        console.log("Server initialized");
      }
      resolve();
    });
  }

  private static listen(socket: io.Socket) {
    // Get - Pedir datos al servidor, no necesita atomicidad
    //       ni sincronizacion con otras instancias.

    socket.on("get", async (event: string, data: any, callback) => {
      if (event.includes("DEFAULT")) {
        Server.get(event, data, callback);
      } else if (event.includes("PRODUCT")) {
        Product.get(event, data, callback);
      } else if (event.includes("SELL")) {
        Sell.get(event, data, callback);
      } else if (event.includes("TOTAL")) {
        Total.get(event, data, callback);
      } else if (event.includes("LOG")) {
        Log.get(event, data, callback);
      } else {
        callback(false);
      }
    });

    // Set - Enviar datos que realizaran una mutacion en la db.
    //       Se encola las solicitudes y se las realiza una a una.

    socket.on("set", async (event: string, data: any, callback) => {
      if (event.includes("PRODUCT")) {
        Product.set(event, data, callback);
      } else if (event.includes("SELL")) {
        Sell.set(event, data, callback);
      } else if (event.includes("TOTAL")) {
        Total.set(event, data, callback);
      } else if (event.includes("LOG")) {
        Log.set(event, data, callback);
      } else {
        callback(false);
      }
    });

    // Test functions
    // socket.on("testSell", async callback => {
    //   // await Firebird.clearTotales();
    //   await Firebird.createSell();
    //   callback("Completed");
    // });

    // Parse backup
    // socket.on("parseBackup", async callback => {
    //   // Server.parseBackup(callback);
    // });
  }
}
