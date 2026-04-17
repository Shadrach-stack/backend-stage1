const express = require("express");
const cors = require("cors");

const profileRoutes = require("./routes/profile.routes");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// base route
app.use("/api", profileRoutes);

module.exports = app;
