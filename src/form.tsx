import { ComponentChild, ComponentChildren, RenderableProps } from 'preact';
import { useCallback, useDebugValue, useEffect, useMemo } from 'preact/hooks';
import { Signal, useSignal } from '@preact/signals'
import { SignalFormCtx } from './context';
import { SignalFormProps } from './types';
import { useDeepSignal } from './deepSignal';
// import { deepSignal, useDeepSignal } from 'deepsignal';

//https://github.com/preactjs/signals/blob/main/docs/demos/react/nesting/index.tsx#L17
// We may land a more comprehensive "Deep" Reactive in core,
// since "Shallow" Reactive is trivial to implement atop Signal:
// export type NestedSignal<T> = { [K in keyof T]: Signal<T[K]> };
// export function toNestedSignal<T extends object>(obj: T) {
//     let reactive = {} as NestedSignal<T>;
//     for (let i in obj) {
//         if (typeof obj[i] == 'object') {
//             reactive[i] = toNestedSignal(obj[i])
//         } else {
//             reactive[i] = useSignal(obj[i]);
//         }
//     }
//     return reactive;
// }
// I dont know if A Form parent container is a good idea but probably is

export const SignalForm = <T extends object,>(p: RenderableProps<SignalFormProps<T>>) => {
    const formSignal = p.signal || useDeepSignal(p.initData as T || {} as T); //|| toMappedSignal(p.initData as any || {})//useDeepSignal<T>(p.initData as any || {});
    // useEffect(() => {
    //     console.log(formSignal);
    //     if (!p.initData) {
    //         if (!p.signal) {
    //             // formSignal = {} as T
    //         } else {
    //             console.info('no init data but has signal')
    //         }
    //     } else {
    //         //formSignal.value = p.initData as T
    //     }
    //     console.log(formSignal);
    // }, [p.initData])
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
        //validate on submit. prop?
        for (let k in ctx.fieldMap) {
            let m = ctx.fieldMap[k];
            if (m.props?.validate) {
                m.valid = m.props.validate(m.signal.value);
                if (!m.valid) {
                    m.class = 'invalid'
                } else {
                    m.class = ''
                }
            }
        }
        p.onSubmit && p.onSubmit(e, formSignal, ctx.fieldMap);
    }, [])
    console.log('Signal Form rendered')
    const ctx = {
        data: formSignal,
        fieldMap: {},
        ctxState: useDeepSignal({
            count: 0
        })
    }
    return (<SignalFormCtx.Provider value={ctx}>
        <form onSubmit={onSubmit}>
            {/* {processChildren(p.children)}
             */}
            {p.children}
        </form>
    </SignalFormCtx.Provider>)
}