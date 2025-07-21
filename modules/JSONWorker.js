export function returnJSON({ code, type = null, message, data = null }) {
    let result = {code: code, status: message};

    if (data)
        Object.assign(result, data);

    return result;
}