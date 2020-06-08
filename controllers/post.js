const Post = require("../models/post");

exports.addPost = (req, res) => {
  const { title, url, description } = req.body;

  const post = new Post();
  post.title = title;
  post.url = url;
  post.description = description;
  post.date = Date.now();

  post.save((err, postSaved) => {
    if (err) {
      return res.status(500).send({
        ok: false,
        message: "Error del servidor al crear post.",
      });
    }

    if (!postSaved) {
      return res.status(400).send({
        ok: false,
        message: "No se ha podido crear el post.",
      });
    }

    return res.status(200).send({
      ok: true,
      message: "Se ha creado el post correctamente.",
      post: postSaved,
    });
  });
};

exports.deletePost = (req, res) => {
  const { id } = req.params;

  Post.findByIdAndRemove({ _id: id }, (err, postDeleted) => {
    if (err) {
      return res.status(500).send({
        ok: false,
        message: "Error del servidor al eliminar post.",
      });
    }

    if (!postDeleted) {
      return res.status(400).send({
        ok: false,
        message: "No se ha podido eliminar el post.",
      });
    }

    return res.status(200).send({
      ok: true,
      message: "Se ha eliminado el post correctamente.",
      post: postDeleted,
    });
  });
};

exports.updatePost = (req, res) => {
  const { id } = req.params;
  const { body } = req;

  Post.findByIdAndUpdate({ _id: id }, body, (err, postUpdated) => {
    if (err) {
      return res.status(500).send({
        ok: false,
        message: "Error del servidor al actualizar post.",
      });
    }

    if (!postUpdated) {
      return res.status(400).send({
        ok: false,
        message: "No se ha podido actualizar el post.",
      });
    }

    return res.status(200).send({
      ok: true,
      message: "Se ha actualizado el post correctamente.",
      post: postUpdated,
    });
  });
};

exports.getPosts = (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const options = {
    page,
    limit: parseInt(limit),
    sort: { date: "desc" },
  };

  Post.paginate({}, options, (err, postsStored) => {
    if (err) {
      return res.status(500).send({
        ok: false,
        message: "Error del servidor al listar post.",
      });
    }

    if (!postsStored) {
      return res.status(400).send({
        ok: false,
        message: "No se ha podido listar el posts.",
      });
    }

    return res.status(200).send({
      ok: true,
      message: "Se han listado los posts correctamente.",
      posts: postsStored,
    });
  });
};

exports.getPost = (req, res) => {
  const { url } = req.params;

  Post.findOne({ url: url }, (err, postFounded) => {
    if (err) {
      return res.status(500).send({
        ok: false,
        message: "Error del servidor al listar post.",
      });
    }

    if (!postFounded) {
      return res.status(400).send({
        ok: false,
        message: "No se ha podido listar el post.",
      });
    }

    return res.status(200).send({
      ok: true,
      message: "Se ha listado el post correctamente.",
      post: postFounded,
    });
  });
};
