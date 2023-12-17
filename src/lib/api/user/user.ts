import axios from "axios";
import { Response } from "../../types/Response";
import API from "../API";


const UserAPI = {
    login: new API<{
        username: string;
        password: string;
    }, Response<string>>({
        path: '/user/login',
        type: 'POST'
    }),
    register: new API<{
        username: string;
        password: string;
        name:string;
    },Response>({
        path: '/user/register',
        type: 'POST'
    })
}


export const login = async (username: string, password: string) => {
    return await UserAPI.login.request({
        username,
        password
    }, false);
}

export const register = async (username: string, password: string,name:string) => {
    return await UserAPI.register.request({
        username,
        password,
        name
    }, false);
}

const User = {
    login,
    register
}

export default User