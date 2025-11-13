import { InputProps, LabelValue } from "../types";
export type CheckboxGroupInputProps<ValueType extends string | number, ContainingType> = InputProps<ValueType[] | ValueType, ContainingType> & {
    items: LabelValue[];
    multiple?: boolean;
};
export declare function CheckboxGroupInput<ValueType extends string | number = string, ContainingType = never>(p: CheckboxGroupInputProps<ValueType, ContainingType>): import("preact").JSX.Element;
