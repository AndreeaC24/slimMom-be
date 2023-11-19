const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();
mongoose.Promise = global.Promise;

const PORT = process.env.PORT || 5000;
const mongoDB = process.env.MONGO_URL;

app.listen(PORT, () => {
  console.log(`The server is running at the port ${PORT}`);
  mongoose
    .connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("Database connection successful");
    })
    .catch((err) => {
      console.error(`Server not running. Error:`, err);
      process.exit(1);
    });
});
