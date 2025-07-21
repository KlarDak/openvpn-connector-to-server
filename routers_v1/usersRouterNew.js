import express from 'express';
import { getUUID } from '../modules/userToken.js';
import { getDefaultNameV1 } from '../modules/secretGetter.js';
import { createConfig, getConfig, deleteConfig } from '../modules/configFiles.js';

const usersRouter = express.Router();

usersRouter.get("/config/:token", async (req, res) => {
    const __getUUID = getUUID(req.params.token);

    if (__getUUID.code !== 200) {
        return res.status(__getUUID.code).json(__getUUID);
    }

    const __configPath = await getConfig(__getUUID.userUuid);

    if (__configPath.code === 200) {
        return res.download(__configPath.path, getDefaultNameV1());
    }
    else {
        return res.status(__configPath.code).json(__configPath);
    }
});

usersRouter.post("/config", async (req, res) => {
    const __getUUID = getUUID(req.body.token);

    if (__getUUID.code !== 200) {
        return res.status(__getUUID.code).json(__getUUID);
    }

    const __configFilePath = await createConfig(__getUUID.userUuid);

    if (__configFilePath.code === 200) {
        return res.download(__configFilePath.path, getDefaultNameV1());
    }
    else {
        return res.status(__configFilePath.code).json(__configFilePath);
    }
});

usersRouter.put("/config/:token", (req, res) => {
    // NOT AVAILABLE NOW
});

usersRouter.delete("/config/:token", async (req, res) => {
    const __getUUID = getUUID(req.params.token);

    if (__getUUID.code !== 200) {
        return res.status(__getUUID.code).json(__getUUID);
    }

    const __isDeteled = await deleteConfig(__getUUID.userUuid);

    return res.status(__isDeteled.code).json(__isDeteled);
});

export default usersRouter; 