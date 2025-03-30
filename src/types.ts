import { RenderableProps } from "preact";
import { ChangeEvent, HTMLInputTypeAttribute } from "preact/compat"
import { NestedSignal } from "./form";
import { Signal } from "@preact/signals";

export type SignalFormProps<T> = {
    onSubmit?: (e: SubmitEvent, signal: NestedSignal<T>) => void,
    initData?: Partial<T> | undefined,
    signal?: NestedSignal<T>
};

type SignalInputProps<ValueType> = {
    name: string,//keyof ContainingObjType,
    value?: ValueType,
    class?: string
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void,
    onKeyUp?: (e: ChangeEvent<HTMLInputElement>) => void.
    type?: HTMLInputTypeAttribute | undefined,
    signal?: Signal<ValueType>
}
type LabeledSignalInputProps<ValueType> = SignalInputProps<ValueType> & {
    label: string
}
export type InputProps<ValueType> = RenderableProps<Partial<Omit<HTMLInputElement, "value">> & SignalInputProps<ValueType>>;
export type LabeledInputProps<ValueType> = InputProps<ValueType> & LabeledSignalInputProps<ValueType>;