import { SignalFormFieldState } from "./context";
import { KeyboardEvent } from "preact/compat";
import { GenericEvent, InputProps } from "./types";
import { Signal } from "@preact/signals";
export declare function useSignalForm(): {
    formState: {
        $submitting?: Signal<boolean> | undefined;
        $submitted?: Signal<boolean> | undefined;
        $submittedCount?: Signal<number> | undefined;
    } & {
        submitting: boolean;
        submitted: boolean;
        submittedCount: number;
    };
};
export declare function useSignalFormInput<T, CO>(p: InputProps<T, CO>): {
    ctx: import("./context").SignalFormContextData<any>;
    value: Signal<T>;
    onChange: (e: GenericEvent<HTMLInputElement>) => void;
    onKeyUp: (e: KeyboardEvent<HTMLInputElement>) => void;
    inputState: SignalFormFieldState<T>;
};
export declare function useGetInputSignal<T, CO>(p: InputProps<T, CO>): Signal<T>;
