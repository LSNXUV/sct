import { domain } from "@/config/host";
import axios from "axios";
import { Response } from "../Response";

export const login = async (username: string, password: string): Promise<Response<string>> => {

    const { data } = await axios.post<Response<string>>(`${domain}/user/login`, { username, password },{
        'headers':{
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    
    return data;
}