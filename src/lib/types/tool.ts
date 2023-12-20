
/**
 * 一层展开对象类型，方便hover显示完整类型
 */
export type ExpandO<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;


/**
 * 两层展开对象类型，方便hover显示完整类型
 */
export type ExpandOO<T> = T extends infer O ? { [K in keyof O]: ExpandO<O[K]> } : never;

/**
 * n层展开对象类型，方便hover显示完整类型
 */
type Decrement<N extends number> = [...Array<N>]['length'];

export type ExpandON<T, N extends number> = N extends 0 
  ? T 
  : T extends object 
    ? { [K in keyof T]: ExpandON<T[K], Decrement<N>> } 
    : T;

/**
 * expands object types recursively 
 * 递归展开对象类型，方便hover显示完整类型
 */
export type Expand<T> = T extends object
    ? T extends infer O ? { [K in keyof O]: Expand<O[K]> } : never
    : T;
