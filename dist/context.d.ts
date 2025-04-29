import { Signal } from '@preact/signals';
import { DeepSignal } from 'deepsignal';
import { FormState } from './types';
export type SignalFormFieldState<T> = {
    props?: any;
    valid?: boolean;
    inputSignal: Signal<T>;
    class?: string;
    validate: () => boolean;
};
export type SignalFormContextData<T> = {
    data: DeepSignal<T>;
    fieldMap: {
        [key: string]: SignalFormFieldState<T>;
    };
    ctxState: DeepSignal<{
        count: number;
    }>;
    formState: DeepSignal<FormState>;
};
export declare const SignalFormCtx: import("preact").Context<SignalFormContextData<any>>;
