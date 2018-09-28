import Datastore from "nedb";
import path from "path";
import { remote } from "electron";

const dbFolder = remote.app.getPath("userData");

export const products = new Datastore({
  autoload: true,
  filename: path.join(dbFolder, "/db/products.db")
});

export const Total = new Datastore({
  autoload: true,
  filename: path.join(dbFolder, "/db/CurrentTotal.db")
});

export const Totals = new Datastore({
  autoload: true,
  filename: path.join(dbFolder, "/db/Totals.db")
});

export const settings = new Datastore({
  autoload: true,
  filename: path.join(dbFolder, "/db/settings.db")
});

export const sells = new Datastore({
  autoload: true,
  filename: path.join(dbFolder, "/db/sells.db")
});
