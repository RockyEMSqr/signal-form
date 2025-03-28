import { Signal } from "@preact/signals"
import { DeepSignal } from "deepsignal";
import { RenderableProps } from "preact";
import { ChangeEvent, HTMLInputTypeAttribute } from "preact/compat"

export type SignalFormProps<T> = {
    onSubmit?: (e: SubmitEvent, signal: DeepSignal<T>) => void,
    initData?: Partial<T> | undefined,
    signal?: DeepSignal<T>
};

type SignalInputProps<ValueType> = {
    name: string,//keyof ContainingObjType,
    value?: ValueType,
    class?: string
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void,
    type?: HTMLInputTypeAttribute | undefined;
}
type LabeledSignalInputProps<ValueType> = SignalInputProps<ValueType> & {
    label: string
}
export type InputProps<ValueType> = RenderableProps<Partial<Omit<HTMLInputElement, "value">> & SignalInputProps<ValueType>>;
export type LabeledInputProps<ValueType> = InputProps<ValueType> & LabeledSignalInputProps<ValueType>;