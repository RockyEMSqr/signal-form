import { RenderableProps } from "preact";
import { ChangeEvent, HTMLInputTypeAttribute } from "preact/compat";
import { Signal } from "@preact/signals";
import { DeepSignal } from "./deepSignal";
export type SignalFormProps<T> = {
    onSubmit?: (e: SubmitEvent, data: DeepSignal<T>, fieldMap?: any) => void;
    initData?: Partial<T> | undefined;
    signal?: DeepSignal<T>;
};
type Prev = [never, 0, 1, 2, 3, 4, 5, ...0[]];
type DotPrefix<T extends string> = T extends "" ? "" : `.${T}`;
type DotNestedKeys<T, D extends number = 5> = [D] extends [never] ? "" : T extends object ? {
    [K in keyof T & string]: `${K}${DotPrefix<DotNestedKeys<T[K], Prev[D]>>}`;
}[keyof T & string] : "";
type SignalInputProps<ValueType = string, ContainingType = never> = {
    name?: keyof ContainingType | DotNestedKeys<ContainingType>;
    value?: ValueType;
    class?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>, v?: any) => void;
    onKeyUp?: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: HTMLInputTypeAttribute | undefined;
    signal?: Signal<ValueType>;
    validate?: (value: any) => boolean;
    label?: string;
};
export type InputProps<ValueType = string, ContainingType = {}> = RenderableProps<Partial<Omit<HTMLInputElement, "value">> & SignalInputProps<ValueType, ContainingType>>;
export type LabelValue = {
    label: string | number;
    value: string | number;
};
export type SelectInputProps<ValueType, ContainingType = {}> = {
    items: LabelValue[];
} & InputProps<ValueType, ContainingType>;
export type GenericEvent<TargetType extends Element> = Event & {
    currentTarget: TargetType;
};
type Join<K, P> = K extends string | number ? P extends string | number ? `${K}${"" extends P ? "" : "."}${P}` : never : never;
export type Paths<T, D extends number = 10> = [D] extends [never] ? never : T extends object ? {
    [K in keyof T]-?: K extends string | number ? `${K}` | Join<K, Paths<T[K], Prev[D]>> : never;
}[keyof T] : "";
export type Leaves<T, D extends number = 10> = [D] extends [never] ? never : T extends object ? {
    [K in keyof T]-?: Join<K, Leaves<T[K], Prev[D]>>;
}[keyof T] : "";
export {};
