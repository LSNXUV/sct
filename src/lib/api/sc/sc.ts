import API from "../API";
import type { ResponseT } from "@/lib/types/Response";
import type { CourseType } from "../course/course";
import type {StudentType} from "../student/student";
/**
 * [
		{
			"id": 11,
			"course": {
				"id": 102,
				"name": "hadoop",
				"credit": 2,
				"hours": 72
			},
			"student": {
				"id": 4356528009,
				"major": "软件工程",
				"name": "Julie Miller",
				"age": 21,
				"gender": "女",
				"phone": "17213585259",
				"email": "schaeferjill@powers.com"
			},
			"score": null
		}
	]
 */
type SC = {
    id: number;
    course:CourseType,
    student:StudentType,
    score:number | null;
}

const SCAPI = {
    all:new API<{},ResponseT<SC[]>>({
        path:'/sc/all',
        type:'GET'
    }),
    score:new API<{
        id:number | string;
        score:number|null;
    },ResponseT<SC>>({
        path:'/sc/score',
        type:'POST'
    }),
    courseScore:new API<{
        name:string;
    },ResponseT<SC[]>>({
        path:'/sc/scores/name',
        type:'GET'
    }),
    studentScore:new API<{
        name:string;
    },ResponseT<SC[]>>({
        path:'/sc/scores/student',
        type:'GET'
    }),
    save:new API<{
        cid:string | number;
        sid:string | number;
    },ResponseT<SC>>({
        path:'/sc/save',
        type:'POST'
    }),
    delete:new API<{
        id:string;
    },ResponseT<SC>>({
        path:'/sc/delete',
        type:'DELETE'
    })
}

export const getAll = async () => {
    return await SCAPI.all.request({});
}

export const score = async (id:number | string,score:number|null) => {
    return await SCAPI.score.request({
        id,
        score
    });
}

export const courseScore = async (name:string) => {
    return await SCAPI.courseScore.request({
        name
    });
}

export const studentScore = async (name:string) => {
    return await SCAPI.studentScore.request({
        name
    });
}

export const save = async (cid:string | number,sid:string | number) => {
    return await SCAPI.save.request({
        cid,
        sid
    });
}

export const deleteById = async (id:string) => {
    return await SCAPI.delete.request({
        id
    });
}

const SC = {
    getAll,
    score,
    courseScore,
    studentScore,
    save,
    deleteById
}

export default SC
