const moment = require("moment");
const jwt = require("jwt-simple");
const { SECRET_KEY } = require("../config");

exports.ensureAuth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).send({
      ok: false,
      message: "La petición no tiene cabecera de Autenticación.",
    });
  }

  const token = req.headers.authorization.replace(/['"]+/g, "");

  try {
    var payload = jwt.decode(token, SECRET_KEY);

    if (payload.exp <= moment().unix()) {
      return res.status(404).send({
        ok: false,
        message: "El token de la sesión ha caducado.",
      });
    }
  } catch (ex) {
    console.log("Error al verificar autenticación", ex);
    return res.status(404).send({
      ok: false,
      message: "El token de la sesión es invalido.",
    });
  }
  req.user = payload;
  next();
};
