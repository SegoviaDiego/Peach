import electron from "electron";
import path from "path";
import fs from "fs";

let { Menu, MenuItem, BrowserWindow, dialog } = electron.remote;

export default class Print {
  private static route: any;
  private static pdfMake: any;

  public static print(printContent: any) {
    return new Promise(resolve => {
      const win = new BrowserWindow({
        title: "Vista previa",
        show: false,
        webPreferences: {
          plugins: true
        }
      });
      const menu = new Menu();

      menu.append(
        new MenuItem({
          label: "Imprimir",
          click() {
            win.webContents.print();
          }
        })
      );
      menu.append(
        new MenuItem({
          label: "Guardar en PDF",
          click() {
            dialog.showSaveDialog(
              {
                title: "Guardar como PDF",
                filters: [
                  {
                    name: "PDF",
                    extensions: ["pdf"]
                  }
                ]
              },
              path => {
                if (path) {
                  fs.writeFileSync(path, fs.readFileSync(Print.route));
                  win.close();
                }
              }
            );
          }
        })
      );

      win.setMenu(menu);
      win.maximize();
      win.once("ready-to-show", () => {
        win.show();
      });

      Print.prepare();

      Print.pdfMake.createPdf(printContent).getBuffer((res: any) => {
        fs.writeFileSync(Print.route, res);
        win.loadURL(Print.route);
        resolve();
      });
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
