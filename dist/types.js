export {};
//https://stackoverflow.com/questions/58434389/typescript-deep-keyof-of-a-nested-object
// type Join<K, P> = K extends string | number ?
//     P extends string | number ?
//     `${K}${"" extends P ? "" : "."}${P}`
//     : never : never;
// export type Paths<T, D extends number = 10> = [D] extends [never] ? never : T extends object ?
//     { [K in keyof T]-?: K extends string | number ?
//         `${K}` | Join<K, Paths<T[K], Prev[D]>>
//         : never
//     }[keyof T] : ""
// export type Leaves<T, D extends number = 10> = [D] extends [never] ? never : T extends object ?
//     { [K in keyof T]-?: Join<K, Leaves<T[K], Prev[D]>> }[keyof T] : "";
// end https://stackoverflow.com/questions/58434389/typescript-deep-keyof-of-a-nested-object
