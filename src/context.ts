import { Signal } from '@preact/signals';
import { DeepSignal } from 'deepsignal';
import { createContext } from 'preact';

export type SignalFormContextData<T> = {
    data: DeepSignal<T>,
    fieldMap: any
}
export const SignalFormCtx = createContext<SignalFormContextData<any>>({} as any);