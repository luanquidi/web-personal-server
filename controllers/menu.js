const Menu = require("../models/menu");

exports.addMenu = (req, res) => {
  const { title, url, active, order } = req.body;

  const menu = new Menu();
  menu.title = title;
  menu.url = url;
  menu.order = order;
  menu.active = active ? active : false;

  menu.save((err, menuSaved) => {
    if (err) {
      return res.status(500).send({
        ok: false,
        message: "Error del servidor al crear menú",
      });
    }

    if (!menuSaved) {
      return res.status(404).send({
        ok: false,
        message: "No se pudo crear el menú",
      });
    }

    return res.status(200).send({
      ok: true,
      message: "El menú se ha creado correctamente",
      menu: menuSaved,
    });
  });
};

exports.getMenus = (req, res) => {
  Menu.find()
    .sort({ order: "asc" })
    .then((menus) => {
      if (menus.length === 0) {
        return res.status(404).send({
          ok: false,
          message: "No hay menús",
        });
      }

      return res.status(200).send({
        ok: true,
        message: "Listado de menús",
        menus: menus,
      });
    });
};

exports.updateMenu = (req, res) => {
  const menu = req.body;
  const { id } = req.params;

  Menu.findByIdAndUpdate({ _id: id }, menu, (err, menuUpdated) => {
    if (err) {
      return res.status(500).send({
        ok: false,
        message: "Error del servidor al actualizar menú",
      });
    }

    if (!menuUpdated) {
      return res.status(404).send({
        ok: false,
        message: "No se pudo actualizar el menú",
      });
    }

    return res.status(200).send({
      ok: true,
      message: "El menú se ha actualizado correctamente",
      menu: menuUpdated,
    });
  });
};

exports.activateAndDeactivateMenu = (req, res) => {
  const { id } = req.params;
  const { active } = req.body;

  Menu.findByIdAndUpdate({ _id: id }, { active }, (err, menuUpdated) => {
    if (err) {
      return res.status(500).send({
        ok: false,
        message: "Error del servidor al activar o desactivar menú",
      });
    }

    if (!menuUpdated) {
      return res.status(404).send({
        ok: false,
        message: "No se pudo cambiar el estado del menú",
      });
    }

    return res.status(200).send({
      ok: true,
      message: "El menú se ha modificado correctamente",
      menu: menuUpdated,
    });
  });
};

exports.deleteMenu = (req, res) => {
  const { id } = req.params;

  Menu.findByIdAndRemove({ _id: id }, (err, menuDeleted) => {
    if (err) {
      return res.status(500).send({
        ok: false,
        message: "Error del servidor al eliminar menú.",
      });
    }

    if (!menuDeleted) {
      return res.status(404).send({
        ok: false,
        message: "No se pudo eliminar el menú.",
      });
    }

    return res.status(200).send({
      ok: true,
      message: "El menú se ha eliminado correctamente.",
      menu: menuDeleted,
    });
  });
};
