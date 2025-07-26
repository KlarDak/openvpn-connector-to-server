import jwt from 'jsonwebtoken';

export function createExpToken(uuid, time, secret) {
    const payload = {
        userUuid: uuid,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + time
    }
    return jwt.sign(payload, secret);
}