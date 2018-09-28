import Sequelize from "../Controllers/Sequelize";
import { Response } from "../Types/SocketTypes";
import { LoginType } from "../Types/LoginTypes";

export function login(data, callback) {
  Sequelize.con()
    .import("../Models/Account")
    .findOne({
      where: {
        username: data.username
      }
    })
    .then(user => {
      if (!user)
        callback({
          error: {
            code: 0,
            message: "El usuario no existe."
          }
        });
      else if (data.password === user.get("password"))
        callback({
          payload: user
        });
      else
        callback({
          error: {
            code: 1,
            message: "La contraseña es incorrecta."
          }
        });
    })
    .catch(error => {
      callback({
        error: {
          error: error,
          code: 2,
          message: "Ha ocurrido un error inesperado."
        }
      });
    });
}
