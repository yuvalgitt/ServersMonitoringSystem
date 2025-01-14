const express = require("express");
const postgresDatabase = require('./database/pg')
const {automatedWorker} = require('./utils/automatedWorker')
const serverRouter = require("./routes/serverRoutes");
const { getAllServers } = require("./services/serverService");

const app = express();
postgresDatabase.connect() //connects to postgreSql
app.use(express.json());

app.use("/servers", serverRouter);
// index.js -> serverRoutes.js -> serverController -> serverService


app.listen(3000, "0.0.0.0", () =>
  console.log("\x1b[42mServer is running on http://localhost:3000\x1b[0m")
);

// gets a list of the server on the database and begins monitoring them
const fetchDataAndStartAutomaticWorker = async() => {
  const serverArray = await getAllServers()
  automatedWorker(serverArray)
  
}
fetchDataAndStartAutomaticWorker()


