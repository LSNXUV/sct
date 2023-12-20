import API from "../API"
import type { ResponseT } from "@/lib/types/Response"
/* 
{
	"code": 0,
	"msg": "ok",
	"data": {
		"content": [
			{
				"id": 2021435847,
				"major": "人工智能",
				"name": "晓月",
				"age": 21,
				"gender": "女",
				"phone": "14987526475",
				"email": "dbwkv@gmail.com"
			},
			{
				"id": 2025410105,
				"major": "计算机科学",
				"name": "明轩",
				"age": 21,
				"gender": "男",
				"phone": "18354679201",
				"email": "xuanming5621@qq.com"
			},
			{
				"id": 2025410106,
				"major": "生物工程",
				"name": "晓霞",
				"age": 22,
				"gender": "女",
				"phone": "17584930267",
				"email": "xiaoxia7234@qq.com"
			},
			{
				"id": 2025410107,
				"major": "机械工程",
				"name": "建国",
				"age": 20,
				"gender": "男",
				"phone": "19283746501",
				"email": "jianguo9845@qq.com"
			},
			{
				"id": 2025410108,
				"major": "心理学",
				"name": "莉娜",
				"age": 19,
				"gender": "女",
				"phone": "18764593028",
				"email": "lina6587@qq.com"
			}
		],
		"pageable": {
			"pageNumber": 1,
			"pageSize": 5,
			"sort": {
				"sorted": false,
				"empty": true,
				"unsorted": true
			},
			"offset": 5,
			"paged": true,
			"unpaged": false
		},
		"totalPages": 6,
		"totalElements": 30,
		"last": false,
		"size": 5,
		"number": 1,
		"sort": {
			"sorted": false,
			"empty": true,
			"unsorted": true
		},
		"numberOfElements": 5,
		"first": false,
		"empty": false
	}
}
*/

export type StudentType = {
    id:string,
    major:string,
	name:string,
	age:number,
	gender:string,
	phone:string,
	email:string
}

export type StudentPageType = {
	content:StudentType[],
	pageable:{
		pageNumber:number,
		pageSize:number,
		sort:{
			sorted:boolean,
			empty:boolean,
			unsorted:boolean
		},
		offset:number,
		paged:boolean,
		unpaged:boolean
	},
	totalPages:number,
	totalElements:number,
	last:boolean,
	size:number,
	number:number,
	sort:{
		sorted:boolean,
		empty:boolean,
		unsorted:boolean
	},
	numberOfElements:number,
	first:boolean,
	empty:boolean
}

const StudentAPI = {
    all: new API<{
        page: string|number|undefined;
        size: string|number|undefined;
    }, ResponseT<StudentPageType>>({
        path: '/student/all',
        type: 'GET'
    }),
    searchByName: new API<{
        name: string;
    }, ResponseT<StudentType[]>>({
        path: '/student/searchByName',
        type: 'GET'
    }),
	searchById: new API<{
		id: string;
	}, ResponseT<StudentType>>({
		path: '/student/searchById',
		type: 'GET'
	}),
	save: new API<StudentType, ResponseT<StudentType>>({
		path: '/student/save',
		type: 'POST'
	}),
	delete: new API<{
		id: string;
	}, ResponseT<StudentType>>({
		path: '/student/delete',
		type: 'DELETE'
	}),
}

export const getAll = async (page?:string|number|undefined,size?:string|number|undefined) => {
	return await StudentAPI.all.request({
		page,
		size
	});
}

export const searchByName = async (name:string) => {
	return await StudentAPI.searchByName.request({
		name
	});
}

export const searchById = async (id:string) => {
	return await StudentAPI.searchById.request({
		id
	});
}

export const save = async (student:StudentType) => {
	return await StudentAPI.save.request(student);
}

export const deleteById = async (id:string) => {
	return await StudentAPI.delete.request({
		id
	});
}


const Student = {
	getAll,
	searchByName,
	searchById,
	save,
	deleteById
}

export default Student