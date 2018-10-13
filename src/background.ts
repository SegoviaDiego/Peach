"use strict";

import {
  app,
  protocol,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  Menu,
  Tray
} from "electron";
import { autoUpdater } from "electron-updater";
import * as path from "path";
import { format as formatUrl } from "url";
import {
  createProtocol,
  installVueDevtools
} from "vue-cli-plugin-electron-builder/lib";
const isDevelopment = process.env.NODE_ENV !== "production";
if (isDevelopment) {
  // Don't load any native (external) modules until the following line is run:
  require("module").globalPaths.push(process.env.NODE_MODULES_PATH);
}

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow: any;
let mainTray: any;
declare var __static: any;

// Standard scheme must be registered before the app is ready
protocol.registerStandardSchemes(["app"], { secure: true });

//Make Peach a Single Instance Application
let shouldQuit = app.makeSingleInstance(() => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    else if (!mainWindow.isVisible()) mainWindow.show();
    mainWindow.center();
    mainWindow.focus();
  }
});

if (shouldQuit) {
  app.quit();
} else {
  // quit application when all windows are closed
  app.on("window-all-closed", () => {
    // on macOS it is common for applications to stay open until the user explicitly quits
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    // on macOS it is common to re-create a window even after all windows have been closed
    if (mainWindow === null) {
      mainWindow = createMainWindow();
    }
  });

  // create main BrowserWindow when electron is ready
  app.on("ready", async () => {
    if (isDevelopment && !process.env.IS_TEST) {
      // Install Vue Devtools
      await installVueDevtools();
    }
    mainWindow = createMainWindow();
    buildTray();

    const startMinimized = (process.argv || []).indexOf("--hidden") !== -1;
    if (startMinimized) mainWindow.hide();
  });

  // Auto update
  ipcMain.on("installUpdates", () => {
    autoUpdater.quitAndInstall();
  });

  ipcMain.on("checkForUpdates", (event: any) => {
    autoUpdater.on("error", (e: any) => {
      event.sender.send("updates-reply", {
        type: "error",
        payload: {
          ...e
        }
      });
    });
    autoUpdater.on("update-available", (e: any) => {
      event.sender.send("updates-reply", {
        type: "available",
        payload: {
          ...e
        }
      });
    });
    autoUpdater.on("update-not-available", (e: any) => {
      event.sender.send("updates-reply", {
        type: "not-available",
        payload: {
          ...e
        }
      });
    });
    autoUpdater.on("update-downloaded", () => {
      event.sender.send("updates-reply", {
        type: "downloaded"
      });
    });
    autoUpdater.on("download-progress", ({ percent }: any) => {
      event.sender.send("updates-reply", {
        type: "progress",
        payload: {
          percent: percent
        }
      });
    });

    autoUpdater.setFeedURL({
      owner: "Holthain",
      provider: "github",
      repo: "peach",
      url: "https://github.com/Holthain/Peach"
    });

    autoUpdater.checkForUpdates();
  });
}

function createMainWindow() {
  const window = new BrowserWindow({
    frame: false,
    resizable: false
  });
  window.maximize();

  if (isDevelopment) {
    // Load the url of the dev server if in development mode
    window.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    if (!process.env.IS_TEST) window.webContents.openDevTools();
  } else {
    createProtocol("app");
    //   Load the index.html when not in development
    window.loadURL(
      formatUrl({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file",
        slashes: true
      })
    );
  }

  window.on("closed", () => {
    mainWindow = null;
  });

  window.webContents.on("devtools-opened", () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    });
  });

  globalShortcut.register("CommandOrControl+Shift+J", () => {
    window.webContents.openDevTools({ mode: "undocked" });
  });

  return window;
}

function buildTray() {
  mainTray = new Tray(path.join(__static, "favicon.ico"));
  mainTray.setToolTip("Peach");

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Cerrar",
      type: "normal",
      click: () => {
        mainWindow.close();
      }
    }
  ]);
  mainTray.setContextMenu(contextMenu);

  mainTray.on("click", () => {
    if (!mainWindow.isVisible()) {
      mainWindow.center();
      mainWindow.show();
    }
  });
}
