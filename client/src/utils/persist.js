export const get = (key) => {
    let value = localStorage.getItem(key);
    return JSON.parse(value);
};

export const put = (key, value) => {
    value = JSON.stringify(value);
    localStorage.setItem(key, value);
};

export const remove = (key) => {
    localStorage.removeItem(key);
};

