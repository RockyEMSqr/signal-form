import { JSX, RenderableProps } from "preact";
import { ChangeEvent, HTMLInputTypeAttribute } from "preact/compat";
import { Signal } from "@preact/signals";
import { DeepSignal } from "deepsignal";
export type SignalFormProps<T> = {
    /**Send a plain old object */
    onSubmit?: (e: SubmitEvent, data: T, dataAsSignal?: DeepSignal<T>, formState?: DeepSignal<FormState<T>>, fieldMap?: any) => void;
    initData?: Partial<T> | undefined;
    signal?: DeepSignal<T>;
    formState?: DeepSignal<FormState<T>>;
    id?: string;
    class?: string;
};
type DotPrefix<T extends string> = T extends '' ? '' : `.${T}`;
type PreviousDepth = [0, 0, 1, 2, 3, 4];
type DotNestedKeysInternal<T, Depth extends number> = Depth extends 0 ? '' : unknown extends T ? string : T extends object ? T extends Date ? '' : T extends readonly (infer Element)[] ? `${number}` | (DotNestedKeysInternal<Element, PreviousDepth[Depth]> extends infer P extends string ? `${number}${DotPrefix<P>}` : never) : {
    [K in keyof T & (string | number)]: DotNestedKeysInternal<T[K], PreviousDepth[Depth]> extends infer P extends string ? `${K}${DotPrefix<P>}` : never;
}[keyof T & (string | number)] : '';
type DotNestedKeys<T> = DotNestedKeysInternal<T, 3>;
export type Path<T = never> = [T] extends [never] ? string : (T extends readonly unknown[] ? number : keyof T) | DotNestedKeys<T>;
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
export type FormState<T> = {
    submitting: boolean;
    submitted: boolean;
    submittedCount: number;
    formDataSignal: T;
};
export {};
