import { JSX, RenderableProps } from "preact";
import { ChangeEvent, HTMLInputTypeAttribute } from "preact/compat";
import { Signal } from "@preact/signals";
import { DeepSignal } from "deepsignal";
export type SignalFormProps<T> = {
    /**Send a plain old object */
    onSubmit?: (e: SubmitEvent, data: T, dataAsSignal?: DeepSignal<T>, formState?: FormState, fieldMap?: any) => void;
    initData?: Partial<T> | undefined;
    signal?: Signal<T> | DeepSignal<T>;
    formState?: DeepSignal<FormState>;
    class?: string;
};
type DotPrefix<T extends string> = T extends '' ? '' : `.${T}`;
type Subtract<A extends number, B extends number> = A extends 0 ? (B extends 0 ? 0 : 0) : A extends 1 ? (B extends 0 ? 1 : 0) : A extends 2 ? (B extends 0 ? 2 : B extends 1 ? 1 : 0) : A extends 3 ? (B extends 0 ? 3 : B extends 1 ? 2 : B extends 2 ? 1 : 0) : A extends 4 ? (B extends 0 ? 4 : B extends 1 ? 3 : B extends 2 ? 2 : B extends 3 ? 1 : 0) : A extends 5 ? (B extends 0 ? 5 : B extends 1 ? 4 : B extends 2 ? 3 : B extends 3 ? 2 : B extends 4 ? 1 : 0) : A extends 6 ? (B extends 0 ? 6 : B extends 1 ? 5 : B extends 2 ? 4 : B extends 3 ? 3 : B extends 4 ? 2 : B extends 5 ? 1 : 0) : A extends 7 ? (B extends 0 ? 7 : B extends 1 ? 6 : B extends 2 ? 5 : B extends 3 ? 4 : B extends 4 ? 3 : B extends 5 ? 2 : B extends 6 ? 1 : 0) : A extends 8 ? (B extends 0 ? 8 : B extends 1 ? 7 : B extends 2 ? 6 : B extends 3 ? 5 : B extends 4 ? 4 : B extends 5 ? 3 : B extends 6 ? 2 : B extends 7 ? 1 : 0) : A extends 9 ? (B extends 0 ? 9 : B extends 1 ? 8 : B extends 2 ? 7 : B extends 3 ? 6 : B extends 4 ? 5 : B extends 5 ? 4 : B extends 6 ? 3 : B extends 7 ? 2 : B extends 8 ? 1 : 0) : A extends 10 ? (B extends 0 ? 10 : B extends 1 ? 9 : B extends 2 ? 8 : B extends 3 ? 7 : B extends 4 ? 6 : B extends 5 ? 5 : B extends 6 ? 4 : B extends 7 ? 3 : B extends 8 ? 2 : B extends 9 ? 1 : 0) : 0;
type DotNestedKeysInternal<T, Depth extends number = 3> = Depth extends 0 ? '' : T extends Date | any[] ? '' : T extends never ? string : T extends object ? {
    [K in keyof T]: K extends symbol ? never : T[K] extends object ? `${K}${DotPrefix<DotNestedKeysInternal<T[K], Subtract<Depth, 1>>>}` : `${K}`;
}[keyof T] : string extends infer D ? Extract<D, string> : never;
type DotNestedKeys<T> = DotNestedKeysInternal<T, 5>;
export type Path<T = never> = [T] extends [never] ? string : keyof T | DotNestedKeys<T>;
export type PathOf<T = never> = Path<T>;
type SignalInputProps<ValueType, ContainingType> = {
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
export type InputProps<ValueType, ContainingType = never> = RenderableProps<Partial<Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "value">> & SignalInputProps<ValueType, ContainingType>>;
export type LabelValue = {
    label: string;
    value: string | number;
};
export type SelectInputProps<ValueType, ContainingType> = {
    items: LabelValue[];
} & InputProps<ValueType, ContainingType>;
export type GenericEvent<TargetType extends Element> = Event & {
    currentTarget: TargetType;
};
export type FormState = {
    submitting: boolean;
    submitted: boolean;
    submittedCount: number;
};
export {};
