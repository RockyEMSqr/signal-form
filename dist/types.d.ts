import { RenderableProps } from "preact";
import { ChangeEvent, HTMLInputTypeAttribute } from "preact/compat";
import { Signal } from "@preact/signals";
import { DeepSignal } from "./deepSignal";
export type SignalFormProps<T> = {
    onSubmit?: (e: SubmitEvent, data: DeepSignal<T>, fieldMap?: any) => void;
    initData?: Partial<T> | undefined;
    signal?: DeepSignal<T>;
};
type NestedKeyOf<ObjectType extends object> = {
    [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}` : `${Key}`;
}[keyof ObjectType & (string | number)];
type SignalInputProps<ValueType = string, ContainingType extends object = {}> = {
    name?: NestedKeyOf<ContainingType>;
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
