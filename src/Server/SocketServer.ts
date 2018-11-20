import express from "express";
import io from "socket.io";
import socketEvents from "../socketEvents";
import { ipcMain } from "electron";

// import Product from "./mongodb/Product";

export default class SocketServer {
  private static server: io.Server;

  public static start() {
    return new Promise((resolve, reject) => {
      if (!SocketServer.server) {
        // Run server on port 3037
        const app = express();
        const server = app.listen(3037);
        SocketServer.server = io.listen(server, { serveClient: false });
        // Listen clients
        SocketServer.server.on("connection", (socket: io.Socket) => {
          SocketServer.listen(socket);
        });

        resolve();
      }
    });
  }

  private static listen(socket: io.Socket) {
    // Get - Pedir datos al servidor, no necesita atomicidad
    //       ni sincronizacion con otras instancias.
    
    // Product.test();

    socket.on("get", (event, callback) => {});
  }
}
