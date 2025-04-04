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

type DeepKeys<T> = T extends object
    ? {
        [K in keyof T]-?: K extends string
        ? | K
        | `${K}.${DeepKeys<T[K]>}`
        : never;
    }[keyof T]
    : never;
type SignalInputProps<ValueType = string, ContainingType = never> = {
    name?: DeepKeys<{ a: number, b: number, c: number }>//ContainingType extends object ? DeepKeys<ContainingType> : string//ContainingType extends never ? string : DeepKeys<ContainingType>,//keyof ContainingObjType,
    value?: ValueType,
    class?: string
    onChange?: (e: ChangeEvent<HTMLInputElement>, v?: any) => void,
    onKeyUp?: (e: ChangeEvent<HTMLInputElement>) => void,
    type?: HTMLInputTypeAttribute | undefined,
    signal?: Signal<ValueType>
    validate?: (value: any) => boolean,
    label?: string
}
export type InputProps<ValueType = string, ContainingType = {}> = RenderableProps<Partial<Omit<HTMLInputElement, "value">> & SignalInputProps<ValueType, ContainingType>>;
// type Primitive = string | number;
export type LabelValue = {
    label: string | number,
    value: string | number
}
export type SelectInputProps<ValueType> = { items: LabelValue[] } & InputProps<ValueType>

export type GenericEvent<TargetType extends Element> = Event & { currentTarget: TargetType };