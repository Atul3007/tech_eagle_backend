const express = require("express");
const { connection } = require("./config/db");
const { router } = require("./routes/authRoute");
const { productRouter } = require("./routes/productRoute");

const cors = require("cors"); 
const app = express();
require('dotenv').config();

app.use(express.json());

app.use(
  cors()
);

const port = process.env.PORT||8080; // Use uppercase PORT

 app.use("/api", router);
 app.use("/api/product/",productRouter)

app.get("/test", (req, res) => {
  try {
    res.send("Welcome");
  } catch (error) {
    console.log("Error");
  }
});

app.listen(port, async () => {
  try {
    await connection;
    console.log("Connected to db");
  } catch (error) {
    console.log("Error occurred");
  }
  console.log(`Running on ${port}`);
});
