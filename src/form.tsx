import { ComponentChild, ComponentChildren, RenderableProps } from 'preact';
import { useCallback, useDebugValue, useEffect, useMemo } from 'preact/hooks';
import { Signal, useSignal } from '@preact/signals'
import { SignalFormContextData, SignalFormCtx } from './context';
import { FormState, SignalFormProps } from './types';
import { deepSignal, useDeepSignal } from './deepSignal';
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
    let formSignal = p.signal || useDeepSignal(p.initData as T || {} as T); //|| toMappedSignal(p.initData as any || {})//useDeepSignal<T>(p.initData as any || {});
    let formState = p.formState || useDeepSignal<FormState>({ submittedCount: 0 } as any)
    if (p.signal instanceof Signal) {
        formSignal = useDeepSignal(p.signal.value);
    }
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
    // const processChild = (child: ComponentChild) => {
    //     if (typeof child == 'function') {
    //         return child(formSignal);
    //     }
    //     return child;

    // };
    // const processChildren = useCallback((children: ComponentChildren) => {
    //     if (Array.isArray(children)) {
    //         let retVal = [];
    //         for (let child of children) {
    //             retVal.push(processChild(child))
    //         }
    //         return retVal;
    //     } else {
    //         return processChild(children)
    //     }

    // }, [p.children])
    const onSubmit = useCallback(async (e: SubmitEvent) => {
        e.preventDefault();

        formState.submitting = true;

        //validate on submit. prop?
        for (let k in ctx.fieldMap) {
            let m = ctx.fieldMap[k];
            m.valid = m.validate();
            if (!m.valid) {
                m.class = 'invalid'
            } else {
                m.class = ''
            }
            // if (m.props?.validate) {
            //     m.valid = m.props.validate(m.inputSignal.value);
            //     if (!m.valid) {
            //         m.class = 'invalid'
            //     } else {
            //         m.class = ''
            //     }
            // }
        }
        p.onSubmit && await p.onSubmit(e, JSON.parse(JSON.stringify(formSignal)), formSignal, formState, ctx.fieldMap);
        formState.submitting = false;
        formState.submitted = true;
        formState.submittedCount = formState.submittedCount + 1;

    }, []);
    const ctx: SignalFormContextData<{}> = {
        data: formSignal,
        fieldMap: {},
        ctxState: useDeepSignal({
            count: 0
        }),
        formState: formState
    }
    return (<SignalFormCtx.Provider value={ctx}>
        <form class={p.class} onSubmit={onSubmit}>
            {/* {processChildren(p.children)}
             */}
            {p.children}
        </form>
    </SignalFormCtx.Provider>)
}