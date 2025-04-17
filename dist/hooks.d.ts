import { SignalFormFieldState } from "./context";
import { KeyboardEvent } from "preact/compat";
import { GenericEvent, InputProps } from "./types";
import { Signal } from "@preact/signals";
export declare function useSignalFormInput<T, CO extends object>(p: InputProps<T, CO>): {
    ctx: import("./context").SignalFormContextData<any>;
    value: Signal<T>;
    onChange: (e: GenericEvent<HTMLInputElement>) => void;
    onKeyUp: (e: KeyboardEvent<HTMLInputElement>) => void;
    inputState: SignalFormFieldState<T>;
};
export declare function useGetInputSignal<T, CO extends object>(p: InputProps<T, CO>): Signal<T>;
