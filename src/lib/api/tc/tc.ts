import API from "../API";

import type { ResponseT } from "@/lib/types/Response";
import type { TeacherType } from "../teacher/teacher";
import type {CourseType} from "../course/course";

/**
 * {
		"id": 1,
		"teacher": {
			"id": 20190102,
			"department": "",
			"name": "王莉",
			"age": 35,
			"gender": "女",
			"phone": "",
			"email": ""
		},
		"course": {
			"id": 102,
			"name": "hadoop",
			"credit": 2,
			"hours": 72
		}
	}
 */

type TCType = {
    id: number;
    teacher:TeacherType,
    course:CourseType
}

const TCAPI = {
    all:new API<{},ResponseT<TCType[]>>({
        path:'/tc/all',
        type:'GET'
    }),
    save:new API<{
        tid:number | string;
        cid:number | string;
    },ResponseT<TCType>>({
        path:'/tc/save',
        type:'POST'
    }),
    delete:new API<{
        id:number | string;
    },ResponseT<TCType>>({
        path:'/tc/delete',
        type:'DELETE'
    })
}

export const getAll = async () => {
    return await TCAPI.all.request({});
}

export const save = async (tid:string,cid:string) => {
    return await TCAPI.save.request({
        tid,
        cid
    });
}

export const deleteById = async (id:string) => {
    return await TCAPI.delete.request({
        id
    });
}

const TC = {
    getAll,
    save,
    deleteById
}

export default TC

