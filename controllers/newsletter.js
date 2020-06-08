const Newsletter = require("../models/newsletter");

exports.suscribeEmail = (req, res) => {
  const { email } = req.params;

  const newsletter = new Newsletter();
  if (!email) {
    return res.status(404).send({
      ok: false,
      message: "Credenciales incorrectas.",
    });
  }
  newsletter.email = email.toLowerCase();

  newsletter.save((err, newsletterCreated) => {
    if (err) {
      return res.status(500).send({
        ok: false,
        message: "El correo ya existe.",
      });
    }

    if (!newsletterCreated) {
      return res.status(404).send({
        ok: false,
        message: "Error al suscribir el correo.",
      });
    }

    return res.status(200).send({
      ok: true,
      message: "Se ha suscrito correctamente",
      newsletter: newsletterCreated
    });
  });
};
