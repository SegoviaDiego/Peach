import firebase from "firebase";
import Settings from "@/Server/Settings";

export default class Firebase {
  private static initializeApp() {
    return new Promise(async resolve => {
      if (!firebase.apps.length) {
        await firebase.initializeApp({
          apiKey: "AIzaSyBGciZmDNcPScGWFt7_K--AIhjS-vyDdeg",
          authDomain: "peach-c4065.firebaseapp.com",
          databaseURL: "https://peach-c4065.firebaseio.com",
          projectId: "peach-c4065"
        });
      }
      resolve();
    });
  }

  public static saveProduct(doc: any) {
    return new Promise((resolve, reject) => {
      // Settings.getCloud().then((cloud: any) => {
      //   if (cloud["instance"]) {
      //     firebase
      //       .functions()
      //       .httpsCallable("saveProduct")({ instance: cloud["instance"], doc })
      //       .then(() => {
      //         resolve();
      //       })
      //       .catch((err: any) => {
      //         reject();
      //         throw err;
      //       });
      //   }
      // });
    });
  }
  public static deleteProduct(_id: any) {}
  public static saveIngreso() {}
  public static saveEgreso() {}
  public static saveSell() {}
  public static saveCierre() {}

  public static auth(): Promise<firebase.auth.Auth> {
    return new Promise(async resolve => {
      await Firebase.initializeApp();
      resolve(firebase.auth());
    });
  }

  public static getInstances() {
    return new Promise(resolve => {
      firebase
        .functions()
        .httpsCallable("getInstances")({})
        .then((value: any) => {
          resolve(value.data.instances);
        })
        .catch((err: any) => {
          resolve(false);
          throw err;
        });
    });
  }

  public static saveInstancePreference(payload: any) {
    return new Promise(resolve => {
      firebase
        .functions()
        .httpsCallable("saveInstancePreference")(payload)
        .then(() => {
          resolve();
        })
        .catch((err: any) => {
          resolve(false);
          throw err;
        });
    });
  }
}
