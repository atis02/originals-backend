const express = require("express");
const { PORT } = require("./config");
const sequelize = require("./database");
const cors = require("cors");
// const fileUpload = require('express-fileupload')
const router = require("./routes/index");
const errorHandler = require("./middleware/ErrorHandlingMiddleware");

const app = express();
app.use(cors());
app.use(express.json());
// app.use(fileUpload({}))
app.use("/images", express.static("static")); // Для директории public/images

app.use("/", router);
app.use(errorHandler);

const start = async () => {
  try {
    await sequelize.authenticate();
    // await sequelize.sync({ alter: true });
    console.log(
      "Connection to the database has been established successfully."
    );
    app.listen(PORT, () => console.log(`server started on port ${PORT} `));
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
start();
