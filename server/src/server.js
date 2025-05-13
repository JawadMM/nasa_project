const http = require("http");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

const { loadPlanetsData } = require("./models/planets.model");

dotenv.config();

const PORT = process.env.PORT || 8000;

const MONGODB_URL = process.env.MONGODB_URL;

const server = http.createServer(app);

mongoose.connection.once("open", () => {
  console.log("MongoDB is connected.");
});

mongoose.connection.on("error", (error) => {
  console.error(error);
});

async function startServer() {
  await mongoose.connect(MONGODB_URL);

  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

startServer();
