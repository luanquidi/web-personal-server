const mongoose = require("mongoose");
const app = require("./app");
const port = process.env.PORT || 3977;
const {
  API_VERSION,
  IP_SERVER,
  PORT_DB,
  USER_DB,
  PASSWORD_DB,
} = require("./config");
const urlDatabaseProd = `mongodb+srv://${USER_DB}:${PASSWORD_DB}@cluster0-2dg8m.mongodb.net/web-personal?retryWrites=true&w=majority`;
const urlDatabaseDev = `mongodb://${IP_SERVER}:${PORT_DB}/webpersonal`;

mongoose.set("useFindAndModify", false);

mongoose.connect(
  urlDatabaseProd,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  },
  (err, res) => {
    if (err) throw err;

    console.log("La conexión a la base de datos es correcta.");

    app.listen(port, () => {
      console.log("####################");
      console.log("##### API REST #####");
      console.log("####################");
      console.log(`http://${IP_SERVER}:${port}/api/${API_VERSION}`);
    });
  }
);
