import { RenderableProps } from "preact";
import { ChangeEvent, HTMLInputTypeAttribute } from "preact/compat";
import { Signal } from "@preact/signals";
import { DeepSignal } from "./deepSignal";
export type SignalFormProps<T> = {
    onSubmit?: (e: SubmitEvent, data: DeepSignal<T>, fieldMap?: any) => void;
    initData?: Partial<T> | undefined;
    signal?: DeepSignal<T>;
};
export type Primitive = null | undefined | string | number | boolean | symbol | bigint;
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
export type IsEqual<T1, T2> = T1 extends T2 ? (<G>() => G extends T1 ? 1 : 2) extends <G>() => G extends T2 ? 1 : 2 ? true : false : false;
/**
 * Helper function to break apart T1 and check if any are equal to T2
 *
 * See {@link IsEqual}
 */
type AnyIsEqual<T1, T2> = T1 extends T2 ? IsEqual<T1, T2> extends true ? true : never : never;
/**
 * Helper type for recursively constructing paths through a type.
 * This actually constructs the strings and recurses into nested
 * object types.
 *
 * See {@link Path}
 */
type PathImpl<K extends string | number, V, TraversedTypes> = V extends Primitive | BrowserNativeObject ? `${K}` : true extends AnyIsEqual<TraversedTypes, V> ? `${K}` : `${K}` | `${K}.${PathInternal<V, TraversedTypes | V>}`;
/**
 * Type to query whether an array type T is a tuple type.
 * @typeParam T - type which may be an array or tuple
 * @example
 * ```
 * IsTuple<[number]> = true
 * IsTuple<number[]> = false
 * ```
 */
export type IsTuple<T extends ReadonlyArray<any>> = number extends T['length'] ? false : true;
/**
* Type which given a tuple type returns its own keys, i.e. only its indices.
* @typeParam T - tuple type
* @example
* ```
* TupleKeys<[number, string]> = '0' | '1'
* ```
*/
export type TupleKeys<T extends ReadonlyArray<any>> = Exclude<keyof T, keyof any[]>;
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
type PathInternal<T, TraversedTypes = T> = T extends ReadonlyArray<infer V> ? IsTuple<T> extends true ? {
    [K in TupleKeys<T>]-?: PathImpl<K & string, T[K], TraversedTypes>;
}[TupleKeys<T>] : PathImpl<ArrayKey, V, TraversedTypes> : {
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
export type Path<T> = T extends any ? PathInternal<T> : never;
type SignalInputProps<ValueType = string, ContainingType extends object = {}> = {
    name?: Path<ContainingType>;
    value?: ValueType;
    class?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>, v?: any) => void;
    onKeyUp?: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: HTMLInputTypeAttribute | undefined;
    signal?: Signal<ValueType>;
    validate?: (value: any) => boolean;
    label?: string;
};
export type InputProps<ValueType = string, ContainingType extends object = {}> = RenderableProps<Partial<Omit<HTMLInputElement, "value">> & SignalInputProps<ValueType, ContainingType>>;
export type LabelValue = {
    label: string;
    value: string;
};
export type SelectInputProps<ValueType, ContainingType extends object = {}> = {
    items: LabelValue[];
} & InputProps<ValueType, ContainingType>;
export type GenericEvent<TargetType extends Element> = Event & {
    currentTarget: TargetType;
};
export {};
