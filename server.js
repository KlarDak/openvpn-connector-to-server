import express from 'express';
import dotenv from "dotenv";
import usersRouter from './routers_v1/usersRouterNew.js';
import { getServerAddress, getServerPort } from './modules/secretGetter.js';

const app = express();
dotenv.config({debug: false, quiet: true});

const allowedIPs = new Set(process.env.ALLOWED_ACCESS?.split(",").filter(Boolean) || []);

app.use((req, res, next) => {
    const userIP = req.ip;

    if (!allowedIPs.has(userIP)) {
        return res.status(403).json({code: 403, error: "Access not allowed!"});
    }

    next();
});

app.use(express.json());

app.use("/v1.1/users", usersRouter);

app.get("/", function (req, res) {
    res.status(403).json({status: "DO NOT use that!"});
});

app.listen(getServerPort(), getServerAddress(), (err) => {
    if (err) {
        console.error(err);
    }

    console.log("The server has been started!");
});