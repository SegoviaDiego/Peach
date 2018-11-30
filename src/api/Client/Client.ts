import { ipcRenderer } from "electron";
import io from "socket.io-client";
import Settings from "./Settings";

export default class Client {
  private static socket: SocketIOClient.Socket;

  public static connect() {
    return new Promise(async (resolve, reject) => {
      const host = await Settings.getHost();
      if (host) {
        // Compruebo que el servidor este iniciado
        await Client.checkServer();
        // Me conecto al servidor
        Client.socket = io(`http://${host}:3037`);
        Client.socket.on("connect", () => {
          console.log("CLIENT - CONNECTED");
          resolve();
        });
      } else {
        reject();
      }
    });
  }

  private static checkServer() {
    return new Promise((resolve, reject) => {
      // Compruebo que esta instancia sea el servidor
      Settings.isServer().then(isServer => {
        if (isServer) {
          // El servidor me avisa que se ha iniciado
          ipcRenderer.on("startServer", async () => {
            // TODO: Inicializar el server con lo que hay
            //       En la funcion Server.initServer()

            resolve();
          });
          // Pido al servidor que se inicie
          ipcRenderer.send("startServer");
        } else {
          resolve();
        }
      });
    });
  }

  public static isConnected(): boolean {
    return Client.socket ? Client.socket.connected : false;
  }

  public static get(event: string, data?: any) {
    return new Promise((resolve, reject) => {
      if (Client.isConnected()) {
        Client.socket.emit(
          "get",
          event,
          data || null,
          (success: boolean, payload: any) => {
            if (success) resolve(payload);
            else reject(payload);
          }
        );
      } else {
        reject();
      }
    });
  }

  public static set(event: string, data?: any) {
    return new Promise((resolve, reject) => {
      if (Client.isConnected()) {
        Client.socket.emit(
          "set",
          event,
          data || null,
          (success: boolean, payload: any) => {
            if (success) resolve(payload);
            else reject(payload);
          }
        );
      } else {
        reject();
      }
    });
  }

  // public static testSell() {
  //   Client.socket.emit("testSell", (res: any) => {
  //     console.log(res);
  //   });
  // }
}