import express from "express";
import io from "socket.io";

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
        SocketServer.server.on("connection", socket => {
          socket.on("test", () => {
            console.log("test event received");
            socket.emit("test", "Funciona loco");
          });
        });
        resolve();
      }
    });
  }
}
