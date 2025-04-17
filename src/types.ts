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




// Error: type of property 'account' circularly references itself in mapped type
// type NestedKeyOf<ObjectType extends object> =
//     { [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
//         ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
//         : `${Key}`
//     }[keyof ObjectType & (string | number)];

// // Helper type to extract keys
// type ExtractKeys<T> = T extends object ? keyof T & string : never;

// /**
//  * Extracts all possible dot notation paths from an object type.
//  */
// type DotNotationPaths<T> =
//     T extends object
//     ? {
//         [K in ExtractKeys<T>]:
//         | K
//         | (T[K] extends object ? `${K}.${DotNotationPaths<T[K]>}` : never);
//     }[ExtractKeys<T>]
//     : never;

// // Helper type to extract keys
// type ExtractKeys<T> = T extends object ? keyof T & string : never;

// /**
//  * Extracts all possible dot notation paths from an object type,
//  * handling circular references.
//  */
// type DotNotationPaths<T> = T extends object
//     ? _DotNotationPaths<T, never, 0> // Start with an empty visited set and depth 0
//     : never;

// // Helper type to track visited objects and limit recursion depth
// type _DotNotationPaths<
//     T,
//     Visited extends object,
//     Depth extends number = 0
// > = Depth extends 5 // Limit recursion to a maximum depth of 5 (adjust as needed)
//     ? never // Stop recursion and return never
//     : T extends object
//     ? {
//         [K in ExtractKeys<T>]:
//         | K
//         | (T[K] extends object
//             ? T[K] extends Visited // Check for circular reference
//                 ? never // If circular, return never
//                 : `${K}.${_DotNotationPaths<T[K], Visited | T, Depth extends never ? 1 : (Depth + 1)>}` // Recurse, add to visited, and increment depth
//             : never);
//     }[ExtractKeys<T>]
//     : never;

//https://github.com/react-hook-form
export type Primitive =
  | null
  | undefined
  | string
  | number
  | boolean
  | symbol
  | bigint;
export type BrowserNativeObject = Date | FileList | File;
/**
 * Checks whether T1 can be exactly (mutually) assigned to T2
 * @typeParam T1 - type to check
 * @typeParam T2 - type to check against
 * ```
 * IsEqual<string, string> = true
 * IsEqual<'foo', 'foo'> = true
 * IsEqual<string, number> = false
 * IsEqual<string, number> = false
 * IsEqual<string, 'foo'> = false
 * IsEqual<'foo', string> = false
 * IsEqual<'foo' | 'bar', 'foo'> = boolean // 'foo' is assignable, but 'bar' is not (true | false) -> boolean
 * ```
 */
export type IsEqual<T1, T2> = T1 extends T2
  ? (<G>() => G extends T1 ? 1 : 2) extends <G>() => G extends T2 ? 1 : 2
    ? true
    : false
  : false;
/**
 * Helper function to break apart T1 and check if any are equal to T2
 *
 * See {@link IsEqual}
 */
type AnyIsEqual<T1, T2> = T1 extends T2
  ? IsEqual<T1, T2> extends true
    ? true
    : never
  : never;

/**
 * Helper type for recursively constructing paths through a type.
 * This actually constructs the strings and recurses into nested
 * object types.
 *
 * See {@link Path}
 */
type PathImpl<K extends string | number, V, TraversedTypes> = V extends
  | Primitive
  | BrowserNativeObject
  ? `${K}`
  : // Check so that we don't recurse into the same type
    // by ensuring that the types are mutually assignable
    // mutually required to avoid false positives of subtypes
    true extends AnyIsEqual<TraversedTypes, V>
    ? `${K}`
    : `${K}` | `${K}.${PathInternal<V, TraversedTypes | V>}`;
/**
 * Type to query whether an array type T is a tuple type.
 * @typeParam T - type which may be an array or tuple
 * @example
 * ```
 * IsTuple<[number]> = true
 * IsTuple<number[]> = false
 * ```
 */
export type IsTuple<T extends ReadonlyArray<any>> = number extends T['length']
  ? false
  : true;
  /**
 * Type which given a tuple type returns its own keys, i.e. only its indices.
 * @typeParam T - tuple type
 * @example
 * ```
 * TupleKeys<[number, string]> = '0' | '1'
 * ```
 */
export type TupleKeys<T extends ReadonlyArray<any>> = Exclude<
keyof T,
keyof any[]
>;
/**
 * Type which can be used to index an array or tuple type.
 */
export type ArrayKey = number;
/**
 * Helper type for recursively constructing paths through a type.
 * This obscures the internal type param TraversedTypes from exported contract.
 *
 * See {@link Path}
 */
type PathInternal<T, TraversedTypes = T> =
  T extends ReadonlyArray<infer V>
    ? IsTuple<T> extends true
      ? {
          [K in TupleKeys<T>]-?: PathImpl<K & string, T[K], TraversedTypes>;
        }[TupleKeys<T>]
      : PathImpl<ArrayKey, V, TraversedTypes>
    : {
        [K in keyof T]-?: PathImpl<K & string, T[K], TraversedTypes>;
      }[keyof T];

/**
 * Type which eagerly collects all paths through a type
 * @typeParam T - type which should be introspected
 * @example
 * ```
 * Path<{foo: {bar: string}}> = 'foo' | 'foo.bar'
 * ```
 */
// We want to explode the union type and process each individually
// so assignable types don't leak onto the stack from the base.
export type Path<T> = T extends any ? PathInternal<T> : never;

type SignalInputProps<ValueType = string, ContainingType extends object = {}> = {
    name?: Path<ContainingType>;
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