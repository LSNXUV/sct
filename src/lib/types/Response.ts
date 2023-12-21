import { Expand } from "./tool";

/**
 * 自定义响应类型
 * @param {number} code 状态码
 * @param {string} msg 提示信息
 * @param {any} data 响应数据
 * @returns {Response} 响应类型
 * @example
 * ```ts
 * const res:Response<string> = {
 *    code:200,
 *   msg:'success',
 *  data:'hello world'
 * }
 * ```
 * @example
 * ```ts
 * const res:Response = {
 *   code:200,
 *  msg:'success'
 * }
 * ```
 */
export type ResponseT<T = unknown> = Expand<
    { code: number; msg: string; } 
&   (T extends unknown ? (unknown extends T ? {} : { data: T }) : never)>;

export type ResponseData = {
    code: number;
    msg: string;
    data?: any;
}
