import jwt from 'jsonwebtoken';
import { returnJSON } from './JSONWorker.js';
import { getSecretToken } from './secretGetter.js';

export function decryptToken(token, secret){
    try {
        const __deToken = jwt.verify(token, secret);
        return __deToken;
    }
    catch(exp) {
        return false;
    }
}

export function validUUID(uuid) {
    return (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid));
}

export function getUUID(token) {
    const __decodeToken = decryptToken(token, getSecretToken());

    if (!__decodeToken) {
        return returnJSON({ code: 400, type: "error", message: "Undefined auth-token" });
    }

    const __validUUID = validUUID(__decodeToken.userUuid);

    if (__validUUID)
        return returnJSON({ code: 200, type: "data", message: "Success", data: { ...__decodeToken } });
    else
        return returnJSON({ code: 400, type: "error", message: "Invalid UUID-token" });
}

// For v1.2
export function getDecryptToken(token) {
    const __decodeToken = decryptToken(token, getSecretToken());

    if (!__decodeToken) {
        return returnJSON({ code: 400, message: "Undefined auth-token" });
    }

    const __validUUID = validUUID(__decodeToken.userUuid);

    if (__validUUID)
        return returnJSON({ code: 200, type: "data", message: "Success", data: { ...__decodeToken }});
    else
        return returnJSON({ code: 400, type: "error", message: "Invalid UUID-token" });
}
