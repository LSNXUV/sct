
export const domain = 'https://api.sb.lsnx.top';
// export const domain = 'http://localhost:8080';

export const getAPI = (path: string) => {
    return `${domain}${path}`;
}