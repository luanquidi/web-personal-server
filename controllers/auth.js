const jwt = require("../services/jwt");
const moment = require("moment");
const User = require("../models/user");

function checkExpiredToken(token) {
  const { exp } = jwt.decodedToken(token);
  const currentDate = moment().unix();

  if (currentDate > exp) {
    return true;
  }

  return false;
}

function refreshAccessToken(req, res) {
  const { refreshToken } = req.body;
  const isTokenExpired = checkExpiredToken(refreshToken);

  if (isTokenExpired) {
    return res.status(404).send({
      ok: false,
      message: "El refreshToken ha caducado.",
    });
  } else {
    const { id } = jwt.decodedToken(refreshToken);

    User.findOne({ _id: id }, (err, userFound) => {
      if (err) {
        return res.status(500).send({
          ok: false,
          message: "Error del servidor.",
        });
      }
      if (!userFound) {
        return res.status(404).send({
          ok: false,
          message: "El usuario no existe.",
        });
      }

      return res.status(200).send({
        ok: true,
        message: "Nuevo accessToken.",
        accessToken: jwt.createAccessToken(userFound),
        refreshToken: refreshToken,
      });
    });
  }
}

module.exports = {
  refreshAccessToken,
};
