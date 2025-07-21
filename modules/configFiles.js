import { exec } from "child_process";
import { getConfigFolder, getScriptFile } from "./secretGetter.js";
import { returnJSON } from "./JSONWorker.js";
import { constants, access } from "fs";

export function createConfig(uuid) {
    const __path = getScriptFile() + ` create ${uuid}`;
    const __configPath = getConfigFolder() + `${uuid}.ovpn`;

    if (__path && __configPath) {
        return new Promise((resolve) => {
            exec(`sudo ${__path}`, (err, stdout, stderr) => {
                if (err){
                    if (err.code === 2) {
                        return resolve(returnJSON({ code: 409, type: "error", message: "File was founded and not re-generate" }));
                    }
                    
                    return resolve(returnJSON({ code: 500, type: "error", message: "Failed to generate the config-file" }));
                }
                
                access(__configPath, constants.F_OK, (err) => {
                    if (err) {
                        return resolve(returnJSON({ code: 404, type: "error", message: "File was not created" }));
                    }
                    
                    return resolve(returnJSON({ code: 200, type: "data", message: "Success", data: { path: __configPath } }));
                });
            });
        });
    }
    else {
        return returnJSON({ code: 401, type: "error", message: "Error with config paths"});
    }
}

export function getConfig(uuid) {
    const __path = getConfigFolder() + `${uuid}.ovpn`;

    return new Promise((resolve) => {
        access(__path, constants.F_OK, (err) => {
            if (err) {
                resolve(returnJSON({ code: 404, type: "error", message: "File not found" }));
            }
            
            resolve(returnJSON({ code: 200, type: "data", message: "Success", data: { path: __path } }));
        });
    });
}

export function deleteConfig(uuid) {
    const __path = getScriptFile() + ` delete ${uuid}`;
    
    return new Promise((resolve) => {
        exec(`sudo ${__path}`, (err) => {
            if (err) {
                if (err.code === 2) {
                    resolve(returnJSON({ code: 404, type: "message", message: "File not found" }));
                }
                
                resolve(returnJSON({ code: 500, type: "error", message: "Some error has been detected with drop this file. Check logs" }));
            }
            else {
                resolve(returnJSON({ code: 200, type: "message", message: "Deleted" }));
            }
        });
    });
}

export function updateConfig(uuid){}