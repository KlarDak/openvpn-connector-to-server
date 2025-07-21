export function getSecretToken() {
    return process.env.SECRET_TOKEN;
}

export function getConfigFolder() {
    return process.env.CONFIG_FOLDER;
}

export function getScriptFile() {
    return process.env.SCRIPT_FILE;
}

export function getDefaultNameV1() {
    return process.env.DEFAULT_NAME_V1;
}

export function getServerAddress() {
    return process.env.SERVER_ADDRESS;
}

export function getServerPort() {
    return process.env.SERVER_PORT;
}

export function getEnv() {
    return process.env;
}