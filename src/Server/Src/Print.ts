import electron from "electron";
let { Menu, MenuItem, BrowserWindow } = electron.remote;
import path from "path";
import fs from "fs";

export default class Print {
  private static route: any;
  private static pdfMake: any;

  public static print(printContent: any) {
    const win = new BrowserWindow({
      title: "Vista previa",
      show: false,
      webPreferences: {
        plugins: true
      }
    });

    const menu = new Menu();

    // // menu.append(
    // //   new MenuItem({
    // //     label: "Imprimir",
    // //     click() {
    // //     }
    // //   })
    // // );
    // // menu.append(
    // //   new MenuItem({
    // //     label: "Guardar en PDF",
    // //     click() {
    // //       Print.file.download();
    // //     }
    // //   })
    // // );

    win.setMenu(menu);
    win.maximize();
    win.once("ready-to-show", () => {
      win.show();
    });

    Print.prepare();

    Print.pdfMake.createPdf(printContent).getBuffer((res: any) => {
      fs.writeFileSync(Print.route, res);
      win.loadURL(Print.route);
    });
  }

  private static prepare() {
    if (!Print.pdfMake) {
      const pdfMake = require("pdfmake/build/pdfmake.js");
      const pdfFonts = require("pdfmake/build/vfs_fonts.js");
      pdfMake.vfs = pdfFonts.pdfMake.vfs;
      Print.pdfMake = pdfMake;
    }

    if (!Print.route) {
      Print.route = path.join(
        electron.remote.app.getPath("userData"),
        "vistaprevia.pdf"
      );
    }
  }
}
