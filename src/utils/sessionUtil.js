export const saveToSession = (key, value) => {
    sessionStorage.setItem(key, JSON.stringify(value));
};

export const getFromSession = (key) => {
    const val = sessionStorage.getItem(key);
    return val ? JSON.parse(val) : null;
};

export const clearSession = () => {
    sessionStorage.clear();
};