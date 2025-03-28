import { Signal } from '@preact/signals';
import { DeepSignal } from 'deepsignal';
import { createContext } from 'preact';

export type SignalFormContextData<T> = {
    signal: DeepSignal<T>
}
export const SignalFormCtx = createContext<SignalFormContextData<any>>({} as any);