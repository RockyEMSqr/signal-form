import { InputProps } from "../types";
export declare const DateTimeInput: (p: InputProps<string | Date> & {
    timezone?: string;
}) => import("preact").JSX.Element;
export declare function DateInput<ContainingType = never>(p: InputProps<Date | string, ContainingType> & {
    timezone?: string;
}): import("preact").JSX.Element;
