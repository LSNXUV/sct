
export const domain = 'https://api.sb.lsnx.top';

export const getAPI = (path: string) => {
    return `${domain}${path}`;
}