import express from "express";
import apiRouter from './api';
import cookieParser from "cookie-parser";

let app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use("/", apiRouter)

app.listen(3000);