
export type Response<T = never> = { code: number; msg: string; } & (T extends never ? {} : { data: T });

