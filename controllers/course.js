const Course = require("../models/course");

exports.createCurse = (req, res) => {
  const body = req.body;

  const course = new Course();

  course.idCourse = body.idCourse;
  course.link = body.link;
  course.coupon = body.coupon;
  course.price = body.price;
  course.order = body.order;

  course.save((err, courseSaved) => {
    if (err) {
      return res.status(500).send({
        ok: false,
        message: "Error del servidor al crear curso.",
      });
    }

    if (!courseSaved) {
      return res.status(404).send({
        ok: false,
        message: "Error al crear el correo.",
      });
    }

    return res.status(200).send({
      ok: true,
      message: "Se ha creado el curso correctamente.",
      course: courseSaved,
    });
  });
};

exports.getCourses = (req, res) => {
  Course.find()
    .sort({
      order: "asc",
    })
    .exec((err, coursesOderned) => {
      if (err) {
        return res.status(500).send({
          ok: false,
          message: "Error del servidor al listar cursos.",
        });
      }

      if (!coursesOderned) {
        return res.status(404).send({
          ok: false,
          message: "Error al listar cursos.",
        });
      }

      return res.status(200).send({
        ok: true,
        message: "Se han listado los cursos correctamente.",
        courses: coursesOderned,
      });
    });
};

exports.deleteCourse = (req, res) => {
  const { id } = req.params;

  Course.findByIdAndRemove({ _id: id }, (err, courseDeleted) => {
    if (err) {
      return res.status(500).send({
        ok: false,
        message: "Error del servidor al eliminar curso.",
      });
    }

    if (!courseDeleted) {
      return res.status(404).send({
        ok: false,
        message: "Error al eliminar curso.",
      });
    }

    return res.status(200).send({
      ok: true,
      message: "Se ha eliminado el curso correctamente.",
      course: courseDeleted,
    });
  });
};

exports.updateCourse = (req, res) => {
  const { id } = req.params;
  const { body } = req;

  Course.findByIdAndUpdate({ _id: id }, body, (err, courseUpdated) => {
    if (err) {
      return res.status(500).send({
        ok: false,
        message: "Error del servidor al actualizar curso.",
      });
    }

    if (!courseUpdated) {
      return res.status(404).send({
        ok: false,
        message: "Error al actualizar curso.",
      });
    }

    return res.status(200).send({
      ok: true,
      message: "Se ha actualizado el curso correctamente.",
      course: courseUpdated,
    });
  });
};
