import { getAPI } from '@/config/host';
import axios from 'axios';
import { ResponseData } from '../types/Response';

/**
 * API定义
 * @param type 请求类型
 * @param path 请求路径
 * @param endpoint 请求域名,如果不填写，则使用默认域名
 */
type APIdefinition = {
    type: 'GET' | 'POST' | 'PUT' | 'DELETE';
    path: string;
    endpoint?: string;  //如果不填写，则默认为getUrl(path),否则为endpoint+path
}


/**
 * API类
 * @param Request 请求参数类型
 * @param Response 返回参数类型
 * 
 * @method redefine API重定义
 * @method request 发送请求
 * 
 */
class API<Request extends object,Response extends ResponseData> {
    private definition: APIdefinition;

    constructor(definition: APIdefinition) {
        this.definition = definition;
    }

    redefine(definition: Partial<APIdefinition>) {
        this.definition = { ...this.definition, ...definition };
    }

    /**
     * 
     * @param request 请求参数
     * @param auth  是否需要登录授权
     * @returns
     */
    async request(request: Request,auth:boolean = true):Promise<Response> {
        const { type, path, endpoint } = this.definition;

        const url = endpoint ? endpoint + path : getAPI(path);

        return new Promise<Response>((resolve, reject) => {
            axios<ResponseData>({
                method: type,
                url,
                data: request,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': auth ? `Bearer ${localStorage.getItem('sk')}` : '',
                }
            }).then((res) => {
                const { code, msg, data } = res.data;
                resolve({
                    code,
                    msg,
                    ...(data ? { data } : {})
                } as Response)
            }).catch((err) => {
                console.log(err);
                resolve({
                    code: -404,
                    msg: '网络错误'
                } as Response);
            })
        })
    }
}

export default API;