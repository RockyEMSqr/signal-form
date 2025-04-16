import { jsx as _jsx } from "preact/jsx-runtime";
import { useCallback } from 'preact/hooks';
import { SignalFormCtx } from './context';
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
export const SignalForm = (p) => {
    const formSignal = p.signal || useDeepSignal(p.initData || {}); //|| toMappedSignal(p.initData as any || {})//useDeepSignal<T>(p.initData as any || {});
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
    const onSubmit = useCallback((e) => {
        e.preventDefault();
        //validate on submit. prop?
        for (let k in ctx.fieldMap) {
            let m = ctx.fieldMap[k];
            m.valid = m.validate();
            if (!m.valid) {
                m.class = 'invalid';
            }
            else {
                m.class = '';
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
        p.onSubmit && p.onSubmit(e, formSignal, ctx.fieldMap);
    }, []);
    const ctx = {
        data: formSignal,
        fieldMap: {},
        ctxState: useDeepSignal({
            count: 0
        })
    };
    return (_jsx(SignalFormCtx.Provider, { value: ctx, children: _jsx("form", { onSubmit: onSubmit, children: p.children }) }));
};
