import App from "./app";
import * as express from "express";
import "dotenv/config";

const connectDB = require("./lib/connectDB");
const port: number = Number(process.env.PORT) || 4046;
const server: express.Application = new App().server;

connectDB();

server.listen(port, () => console.log(`http://localhost:${port} ServerOn`)).on("error", (err) => console.error(err));
