import express from 'express';
import dotenv from "dotenv";
import usersRouter from './routers_v1/usersRouterNew.js';
import { getServerAddress, getServerPort } from './modules/secretGetter.js';
import cors from 'cors';
import configRouter from './routers_v1/configRouter.js';

const app = express();
dotenv.config({debug: false, quiet: true});

const allowedIPs = new Set(process.env.ALLOWED_ACCESS?.split(",").filter(Boolean) || []);

app.use(cors());

app.use((req, res, next) => {
    const userIP = req.ip;

    if (!allowedIPs.has(userIP)) {
        return res.status(403).json({code: 403, error: "Access not allowed!", "ip": req.ip});
    }

    next();
});

app.use(express.json());

app.use("/v1.1/users", usersRouter);
app.use("/v1.1/configs", configRouter);

app.get("/", function (req, res) {
    res.status(403).json({status: "DO NOT use that!"});
});

app.listen(getServerPort(), getServerAddress(), (err) => {
    if (err) {
        console.error(err);
    }

    console.log("The server has been started!");
});