import { RenderableProps } from "preact";
import { ChangeEvent, HTMLInputTypeAttribute } from "preact/compat"
// import { NestedSignal } from "./form";
import { Signal } from "@preact/signals";
import { DeepSignal } from "./deepSignal";

export type SignalFormProps<T> = {
    onSubmit?: (e: SubmitEvent, data: DeepSignal<T>, fieldMap?: any) => void,
    initData?: Partial<T> | undefined,
    signal?: DeepSignal<T>
};

// type DeepKeys<T> = T extends object
//     ? {
//         [K in keyof T]-?: K extends string
//         ? | K
//         | `${K}.${DeepKeys<T[K]>}`
//         : never;
//     }[keyof T]
//     : never;
//     type DotPrefix<T extends string> = T extends "" ? "" : `.${T}`;

// Recursive helper to build dot-paths
// type DotNestedKeys<T> = (
//   T extends object
//     ? {
//         [K in keyof T & string]: `${K}${DotPrefix<DotNestedKeys<T[K]>>}`
//       }[keyof T & string]
//     : ""
// );
// Helper to count recursion depth
// type DotNestedKeys<T, D extends number = 10> = D extends 0
//     ? never
//     : (T extends object
//         ? {
//             [K in keyof T]-?:
//             | (K extends string ? K : never)
//             | (T[K] extends object ? `${K}.${DotNestedKeys<T[K], Decrement<D>>}` : never);
//         }[keyof T]
//         : never);

// // Helper type to decrement a number
// type Decrement<N extends number> = N extends 0 ? 0 :
//     N extends 1 ? 0 :
//     N extends 2 ? 1 :
//     N extends 3 ? 2 :
//     N extends 4 ? 3 :
//     N extends 5 ? 4 :
//     N extends 6 ? 5 :
//     N extends 7 ? 6 :
//     N extends 8 ? 7 :
//     N extends 9 ? 8 :
//     N extends 10 ? 9 : never;
type NestedKeyOf<ObjectType extends object> =
    { [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
        ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
        : `${Key}`
    }[keyof ObjectType & (string | number)];
type SignalInputProps<ValueType = string, ContainingType extends object = {}> = {
    name?: NestedKeyOf<ContainingType>;
    value?: ValueType,
    class?: string
    onChange?: (e: ChangeEvent<HTMLInputElement>, v?: any) => void,
    onKeyUp?: (e: ChangeEvent<HTMLInputElement>) => void,
    type?: HTMLInputTypeAttribute | undefined,
    signal?: Signal<ValueType>
    validate?: (value: any) => boolean,
    label?: string
}
export type InputProps<ValueType = string, ContainingType extends object = {}> = RenderableProps<Partial<Omit<HTMLInputElement, "value">> & SignalInputProps<ValueType, ContainingType>>;
// type Primitive = string | number;
export type LabelValue = {
    label: string,
    value: string
}
export type SelectInputProps<ValueType, ContainingType extends object = {}> = { items: LabelValue[] } & InputProps<ValueType, ContainingType>

export type GenericEvent<TargetType extends Element> = Event & { currentTarget: TargetType };

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