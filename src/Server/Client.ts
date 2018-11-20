import io from "socket.io-client";

export default class Client {
  private static socket: SocketIOClient.Socket;

  public static connect(host: string) {
    return new Promise(resolve => {
      Client.socket = io(`http://${host}:3037`);
      Client.socket.on("connect", () => {
        console.log("CLIENT - CONNECTED");
        // Listen for server events and responses.
        Client.listen();
        resolve();
      });
    });
  }

  public static isConnected(): Boolean {
    return Client.socket ? Client.socket.connected : false;
  }

  public static get(event: string) {
    return new Promise((resolve, reject) => {
      Client.socket.emit("get", event, (payload: any) => {
        console.log("server respondio");
        console.log(payload);
        // if (payload.data) {
        //   resolve(payload.data);
        // } else if (payload.error) {
        //   console.error(payload.error);
        //   reject(payload.error);
        // }
      });
    });
  }

  public static set() {}

  private static listen() {
    return new Promise(resolve => {
      Client.socket.on("test", () => {
        console.log("Server tested a response");
      });

      Client.socket.emit("test", (res: any) => {
        console.log(res);
      });

      resolve();
    });
  }
}
