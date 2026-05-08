
const getDataInfo = (obj, fileds = []) => {

    const result = {};

    fileds.forEach((field) => {
        result[field] = obj[field];
    });

    return result;
}

export {
    getDataInfo
}