import redis from 'ioredis';
import { getRedisHost, getRedisPort } from './secretGetter';

export const Redis = new redis({host: getRedisHost(), port: getRedisPort()});

export async function createExpConfig(uuid, time) {
    try {
        const uuidAdd = await Redis.set(uuid, time);

        return true;
    }
    catch {
        return false;
    }
}

export async function selectExpConfig(uuid) {
    try {
        const uuidGet = await Redis.exists(uuid);

        if (uuidGet) {
            const lastTime = await Redis.get(uuid);
            return (lastTime == "inactive") ? -1 : lastTime;
        }
        else {
            return false;
        }
    }
    catch {
        return false;
    }
}

export async function updateExpConfig(uuid, time) {
    try {
        const uuidUpdate = await Redis.set(uuid, time);

        return true;
    }
    catch {
        return false;
    }
}

export async function deleteExpConfig(uuid) {
    try {
        const uuidDelete = await Redis.del(uuid);

        return true;
    }
    catch {
        return false;
    }
}