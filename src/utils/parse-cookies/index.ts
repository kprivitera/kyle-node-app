const parseCookies = (cookies: string) => {
    if (!cookies){
        return {};
    }
    return cookies
        .split(";")
        .reduce<Record<string, string>>((obj, c) => {
            const [name, value] = c.split("=");
            obj[name.trim()] = value.trim();
            return obj;
        }, {})
};

export default parseCookies;
