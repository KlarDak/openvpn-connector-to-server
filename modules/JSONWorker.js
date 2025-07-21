export function returnJSON({ code, type, message, data = null }) {
    let result = {code: code};

    if (type === "error") 
        result.error = message;
    else if (type === "data") 
        result.data = message;
    else 
        result.message = message;

    if (data)
        Object.assign(result, data);

    return result;
}