import API from "../API";

import type { ResponseT } from "@/lib/types/Response";

/**
 * {
			"id": 20190102,
			"department": "",
			"name": "王莉",
			"age": 35,
			"gender": "女",
			"phone": "",
			"email": ""
		}
 */

export type TeacherType ={
    id:number;
    department:string;
    name:string;
    age:number;
    gender:string;
    phone:string;
    email:string;
}

const TeacherAPI = {
    all:new API<{},ResponseT<TeacherType[]>>({
        path:'/teacher/all',
        type:'GET'
    }),
    searchByName:new API<{
        name:string;
    },ResponseT<TeacherType>>({
        path:'/teacher/name',
        type:'GET'
    }),
    searchById:new API<{
        id:number | string;
    },ResponseT<TeacherType>>({
        path:'/teacher/id',
        type:'GET'
    }),
    save:new API<TeacherType,ResponseT<TeacherType>>({
        path:'/teacher/save',
        type:'POST'
    }),
    delete:new API<{
        id:number | string;
    },ResponseT<TeacherType>>({
        path:'/teacher/delete',
        type:'DELETE'
    })
}

export const getAll = async () => {
    return await TeacherAPI.all.request({});
}

export const searchByName = async (name:string) => {
    return await TeacherAPI.searchByName.request({
        name
    });
}

export const searchById = async (id:number | string) => {
    return await TeacherAPI.searchById.request({
        id
    });
}

export const save = async (teacher:TeacherType) => {
    return await TeacherAPI.save.request(teacher);
}

export const deleteById = async (id:number | string) => {
    return await TeacherAPI.delete.request({
        id
    });
}

const Teacher = {
    getAll,
    searchByName,
    searchById,
    save,
    deleteById
}

export default Teacher
