import express from "express";

const app = express();

// connect mongodb
import "./databases/init.mongodb.js";

export default app;