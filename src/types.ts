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

type SignalInputProps<ValueType> = {
    name: string,//keyof ContainingObjType,
    value?: ValueType,
    class?: string
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void,
    onKeyUp?: (e: ChangeEvent<HTMLInputElement>) => void,
    type?: HTMLInputTypeAttribute | undefined,
    signal?: Signal<ValueType>
    validate?: (value: string) => void
}
type LabeledSignalInputProps<ValueType> = SignalInputProps<ValueType> & {
    label: string
}
export type InputProps<ValueType> = RenderableProps<Partial<Omit<HTMLInputElement, "value">> & SignalInputProps<ValueType>>;
// type Primitive = string | number;
export type LabelValue = {
    label: string | number,
    value: string | number
}
export type SelectInputProps<ValueType> = { items: LabelValue[] } & InputProps<ValueType>
export type LabeledInputProps<ValueType> = InputProps<ValueType> & LabeledSignalInputProps<ValueType>;
export type LabeledSelectInputProps<ValueType> = { items: LabelValue[] } & LabeledInputProps<ValueType>