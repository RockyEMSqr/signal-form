import { Signal } from '@preact/signals';
import { DeepSignal } from 'deepsignal';
import { createContext } from 'preact';

export type SignalFormContextData<T> = {
    data: DeepSignal<T>,
    fieldMap: any,
    // todo:better name
    ctxState: DeepSignal<{
        count: number
    }>
}
export const SignalFormCtx = createContext<SignalFormContextData<any>>({} as any);