import exp from "constants";
import API from "../API";

import type { ResponseT } from "@/lib/types/Response";

export type CourseType = {
    id: number;
    name: string;
    credit: number;
    hours: number;
}

const CourseAPI = {
    all:new API<{},ResponseT<CourseType[]>>({
        path:'/course/all',
        type:'GET'
    }),
    searchByName:new API<{
        name:string;
    },ResponseT<CourseType>>({
        path:'/course/name',
        type:'GET'
    }),
    save:new API<CourseType,ResponseT<CourseType>>({
        path:'/course/save',
        type:'POST'
    }),
    delete:new API<{
        id:number;
    },ResponseT<CourseType>>({
        path:'/course/delete',
        type:'DELETE'
    })
}

export const getAll = async () => {
    return await CourseAPI.all.request({});
}

export const searchByName = async (name:string) => {
    return await CourseAPI.searchByName.request({
        name
    });
}

export const save = async (course:CourseType) => {
    return await CourseAPI.save.request(course);
}

export const deleteById = async (id:number) => {
    return await CourseAPI.delete.request({
        id
    });
}


const Course = {
    getAll,
    searchByName,
    save,
    deleteById
}

export default Course