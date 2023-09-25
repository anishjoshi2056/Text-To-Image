const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
// Importing Routes
const texttoimageRoute = require("./Routes/texttoimageRoute");
// Connection to Database
mongoose.set("strictQuery", false);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB Atlas:", err);
  });

//Routes
app.get("/", (req, res) => {
  res.send("Welcome to Text to Image API");
});
app.use("/texttoimage", texttoimageRoute);
