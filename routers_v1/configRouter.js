import express from 'express';
import { returnJSON } from '../modules/JSONWorker.js';
import { createExpConfig, selectExpConfig, updateExpConfig, deleteExpConfig } from '../modules/configSetter.js';
import { getDecryptToken, getUUID } from '../modules/userToken.js';

const configRouter = express.Router();

configRouter.get("/check/:token", async (req, res) => {
    const __decodeToken = getUUID(req.params.token);

    if (__decodeToken.code !== 200) {
        return res.status(__decodeToken.code).json(__decodeToken);
    }

    const getExpData = await selectExpConfig(__decodeToken.userUuid);

    if (!getExpData) {
        return res.status(404).json({ code: 404, status: "This config was expired"});
    }
    else {
        const currentTime = getExpData - Date.now();
        return res.status(200).json({ 
            code: 200, 
            status: "Success", 
            time: (currentTime < 0) ? -1 : parseFloat((currentTime / 1000 / 60).toFixed(2)) 
        });
    }
});

configRouter.post("/check", async (req, res) => {
    const __decodeToken = getDecryptToken(req.body.token);
    const __reqTime = req.body.time;

    if (__decodeToken.code !== 200) {
        return res.status(__decodeToken.code).json(__decodeToken);
    }

    if (typeof __reqTime !== "number") {
        return res.status(400).json({ code: 400, status: "Invalid time params" });
    }

    const timeResult = (__reqTime == -1) ? "inactive" : (Date.now() + (__reqTime * 60 * 1000)); 

    const addParams = await createExpConfig(__decodeToken.userUuid, timeResult);

    if (addParams) {
        return res.status(200).json({ code: 200, status: "Uploaded" });
    }
    else {
        return res.status(500).json({ code: 500, status: "Unchecked error" });
    }
});

configRouter.patch("/check", (req, res) => {});

configRouter.delete("/check/:token", async (req, res) => {
    const __decodeToken = getUUID(req.params.token);

    if (__decodeToken.code !== 200) {
        return res.status(__decodeToken.code).json(__decodeToken);
    }

    const deleteExpData = await deleteExpConfig(__decodeToken.userUuid);

    if (!deleteExpData) {
        return res.status(404).json({ code: 404, status: "The config was not founded"});
    }
    else {
        return res.status(200).json({ code: 200, status: "Deleted" });
    }
});

export default configRouter;
