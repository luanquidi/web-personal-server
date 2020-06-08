const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");
const User = require("../models/user");
const fs = require("fs");
const path = require("path");

exports.signUp = (req, res) => {
  const user = new User();
  const { name, lastname, email, password, repeatPassword } = req.body;

  user.name = name;
  user.lastname = lastname;
  user.email = email;
  user.role = "admin";
  user.active = false;

  if (!password || !repeatPassword) {
    res.status(404).send({ message: "Las contraseñas son obligatorias." });
  } else {
    if (password !== repeatPassword) {
      res.status(404).send({ message: "Las contraseñas no son iguales." });
    } else {
      bcrypt.hash(password, null, null, (err, hash) => {
        if (err) {
          res.status(500).send({ message: "Error al encriptar contraseña." });
        } else {
          user.password = hash;
          user.save((err, userSaved) => {
            if (err) {
              res
                .status(500)
                .send({ ok: false, message: "El usuario ya existe." });
            } else {
              if (!userSaved) {
                res
                  .status(404)
                  .send({ ok: false, message: "Error al crear usuario." });
              } else {
                userSaved.password = ":)";
                res.status(200).send({
                  ok: true,
                  message: "Usuario creado.",
                  user: userSaved,
                });
              }
            }
          });
        }
      });
    }
  }
};

exports.signUpAdmin = (req, res) => {
  const user = new User();
  const { name, lastname, email, password, repeatPassword } = req.body;

  user.name = name;
  user.lastname = lastname;
  user.email = email;
  user.role = "admin";
  user.active = true;

  if (!password || !repeatPassword) {
    res.status(404).send({ message: "Las contraseñas son obligatorias." });
  } else {
    if (password !== repeatPassword) {
      res.status(404).send({ message: "Las contraseñas no son iguales." });
    } else {
      bcrypt.hash(password, null, null, (err, hash) => {
        if (err) {
          res.status(500).send({ message: "Error al encriptar contraseña." });
        } else {
          user.password = hash;
          user.save((err, userSaved) => {
            if (err) {
              res
                .status(500)
                .send({ ok: false, message: "El usuario ya existe." });
            } else {
              if (!userSaved) {
                res
                  .status(404)
                  .send({ ok: false, message: "Error al crear usuario." });
              } else {
                userSaved.password = ":)";
                res.status(200).send({
                  ok: true,
                  message: "Usuario creado.",
                  user: userSaved,
                });
              }
            }
          });
        }
      });
    }
  }
};

exports.signIn = (req, res) => {
  const params = req.body;
  const email = params.email.toLowerCase();
  const password = params.password;

  User.findOne({ email }, (err, userFound) => {
    if (err) {
      return res.status(500).send({
        ok: false,
        message: "Error del servidor, por favor intente más tarde.",
      });
    }

    if (!userFound) {
      return res.status(404).send({ ok: false, message: "Usuario no existe." });
    }

    bcrypt.compare(password, userFound.password, (err, check) => {
      if (err) {
        return res
          .status(500)
          .send({ ok: false, message: "Error al comparar credenciales." });
      }
      if (!check) {
        return res
          .status(404)
          .send({ ok: false, message: "Credenciales incorrectas." });
      }
      if (!userFound.active) {
        return res
          .status(404)
          .send({ ok: false, message: "El usuario no está activo :(" });
      } else {
        return res.status(200).send({
          ok: true,
          message: "Ingreso correcto!",
          accessToken: jwt.createAccessToken(userFound),
          refreshToken: jwt.createRefreshToken(userFound),
        });
      }
    });
  });
};

exports.getUsers = (req, res) => {
  User.find().then((users) => {
    if (!users) {
      return res.status(404).send({
        ok: false,
        message: "No hay usuarios registrados.",
      });
    }

    for (let user of users) {
      user.password = ":)";
    }

    return res.status(200).send({
      ok: true,
      message: "Listado de usuarios encontrados",
      users: users,
    });
  });
};

exports.getActiveUsers = (req, res) => {
  const query = req.query;

  User.find({ active: query.active }).then((users) => {
    if (!users) {
      return res.status(404).send({
        ok: false,
        message: "No hay usuarios activos.",
      });
    }

    for (let user of users) {
      user.password = ":)";
    }

    return res.status(200).send({
      ok: true,
      message: "Listado de usuarios activos encontrados",
      users: users,
    });
  });
};

exports.uploadAvatar = (req, res) => {
  const { params } = req;

  User.findById({ _id: params.id }, (err, userFound) => {
    if (err) {
      return res.status(500).send({
        ok: false,
        message: "Error en el servidor",
      });
    }

    if (!userFound) {
      return res.status(404).send({
        ok: false,
        message: "No se pudo encontrar al usuario.",
      });
    }

    const user = userFound;

    if (req.files) {
      const filePath = req.files.avatar.path;
      const fileSplit = filePath.split("/");
      const fileName = fileSplit[2];

      const extSplit = fileName.split(".")[1];

      if (extSplit !== "png" && extSplit !== "jpg") {
        return res.status(404).send({
          ok: false,
          message:
            "Formato de imagen no permitida. (Formato permitido: .png ó .jpg)",
        });
      }

      user.avatar = fileName;
      User.findByIdAndUpdate({ _id: params.id }, user, (err, userUpdated) => {
        if (err) {
          return res.status(500).send({
            ok: false,
            message: "Error del servidor actualizando el usuario.",
          });
        }

        if (!userUpdated) {
          return res.status(404).send({
            ok: false,
            message: "No se pudo encontrar al usuario a actualizar.",
          });
        }

        userUpdated.password = ":)";

        return res.status(200).send({
          ok: true,
          message: "El usuario se ha actualizado correctamente.",
          user: userUpdated,
          avatarName: fileName,
        });
      });
    }
  });
};

exports.getAvatar = (req, res) => {
  const { avatarName } = req.params;

  const filePath = "./uploads/avatar/" + avatarName;

  fs.exists(filePath, (exists) => {
    if (!exists) {
      return res.status(404).send({
        ok: false,
        message: "No hay avatar con este nombre. (" + avatarName + ")",
      });
    }
    return res.sendFile(path.resolve(filePath));
  });
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const user = req.body;

  user.email = user.email.toLowerCase();

  if (user.password) {
    await bcrypt.hash(user.password, null, null, (err, hash) => {
      if (err) {
        return res.status(500).send({
          ok: false,
          message: "Error al encriptar contraseña.",
        });
      }
      user.password = hash;
    });
  }

  User.findByIdAndUpdate({ _id: id }, user, (err, userUpdate) => {
    if (err) {
      return res.status(500).send({
        ok: false,
        message: "Error en el servidor al actualizar usuario.",
      });
    }

    if (!userUpdate) {
      return res.status(404).send({
        ok: false,
        message: "No se encontró el usuario a actualizar.",
      });
    }

    return res.status(200).send({
      ok: true,
      message: "El usuario se actualizó correctamente.",
    });
  });
};

exports.activateUser = (req, res) => {
  const { params, body } = req;
  const active = body.active;
  const _id = params.id;

  console.log(_id, active);

  User.findByIdAndUpdate(_id, { active }, (err, userUpdated) => {
    if (err) {
      return res.status(500).send({
        ok: false,
        message: "Error del servidor al activar usuario)",
      });
    }

    if (!userUpdated) {
      return res.status(404).send({
        ok: false,
        message: "No se encontró el usuario a activar.",
      });
    }

    if (active === true) {
      return res.status(200).send({
        ok: true,
        message: "Se ha activado correctamente",
      });
    }

    return res.status(200).send({
      ok: true,
      message: "Se ha desactivado correctamente",
    });
  });
};

exports.deleteUser = (req, res) => {
  const { id } = req.params;

  User.findByIdAndRemove({ _id: id }, (err, userDeleted) => {
    if (err) {
      return res.status(500).send({
        ok: false,
        message: "Error del servidor al eliminar usuario)",
      });
    }

    if (!userDeleted) {
      return res.status(404).send({
        ok: false,
        message: "No se encontró el usuario a eliminar.",
      });
    }

    return res.status(200).send({
      ok: true,
      message: "El usuario se ha eliminado correctamente.",
    });
  });
};
