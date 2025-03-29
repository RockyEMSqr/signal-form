import { ComponentChild, ComponentChildren, RenderableProps } from 'preact';
import { useCallback, useDebugValue, useEffect, useMemo } from 'preact/hooks';
import { Signal, useSignal } from '@preact/signals'
import { SignalFormCtx } from './context';
import { SignalFormProps } from './types';
// import { deepSignal, useDeepSignal } from 'deepsignal';

//https://github.com/preactjs/signals/blob/main/docs/demos/react/nesting/index.tsx#L17
// We may land a more comprehensive "Deep" Reactive in core,
// since "Shallow" Reactive is trivial to implement atop Signal:
export type NestedSignal<T> = { [K in keyof T]: Signal<T[K]> };
export function toMappedSignal<T extends object>(obj: T) {
    let reactive = {} as NestedSignal<T>;
    for (let i in obj) reactive[i] = useSignal(obj[i]);
    return reactive;
}
function useReactive<T extends object>(obj: T) {
    return useMemo(() => toMappedSignal(obj), []);
}
// I dont know if A Form parent container is a good idea but probably is

export const SignalForm = <T extends object,>(p: RenderableProps<SignalFormProps<T>>) => {
    const formSignal = p.signal || toMappedSignal(p.initData as any || {})//useDeepSignal<T>(p.initData as any || {});
    useEffect(() => {
        console.log(formSignal);
        if (!p.initData) {
            if (!p.signal) {
                // formSignal = {} as T
            } else {
                console.info('no init data but has signal')
            }
        } else {
            //formSignal.value = p.initData as T
        }
        console.log(formSignal);
    }, [p.initData])
    const processChild = (child: ComponentChild) => {
        if (typeof child == 'function') {
            return child(formSignal);
        }
        return child;

    };
    const processChildren = useCallback((children: ComponentChildren) => {
        if (Array.isArray(children)) {
            let retVal = [];
            for (let child of children) {
                retVal.push(processChild(child))
            }
            return retVal;
        } else {
            return processChild(children)
        }

    }, [p.children])
    const onSubmit = useCallback((e: SubmitEvent) => {
        e.preventDefault();
        p.onSubmit && p.onSubmit(e, formSignal);
    }, [])
    return (<SignalFormCtx.Provider value={({ signal: formSignal })}>
        <form onSubmit={onSubmit}>
            {processChildren(p.children)}
        </form>
    </SignalFormCtx.Provider>)
}