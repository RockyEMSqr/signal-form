import type { Signal } from '@preact/signals';
import type { DeepSignal } from 'deepsignal';
import { createContext } from 'preact';
import type { FormState } from './types';

export type SignalFormFieldState<T> = {
    props?: any;
    valid?: boolean,
    inputSignal: Signal<T>,
    class?: string,
    validate: () => boolean
}
export type SignalFormContextData<T> = {
    data: DeepSignal<T>,
    fieldMap: { [key: string]: SignalFormFieldState<T> }  //Map<string, SignalFormFieldState>,
    // todo:better name
    ctxState: DeepSignal<{
        count: number
    }>
    formState: DeepSignal<FormState>
}
export const SignalFormCtx = createContext<SignalFormContextData<any>>({} as any);