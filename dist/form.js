import { jsx as _jsx } from "preact/jsx-runtime";
import { useCallback, useEffect, useRef } from 'preact/hooks';
import { Signal } from '@preact/signals';
import { SignalFormCtx } from './context';
import { useDeepSignal } from './deepSignal';
import { getSignal } from './utils';
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
    let formRef = useRef(null);
    let formSignal = p.signal || useDeepSignal(p.initData || {}); //|| toMappedSignal(p.initData as any || {})//useDeepSignal<T>(p.initData as any || {});
    let formState = p.formState || useDeepSignal({ submittedCount: 0 });
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
    const processChild = (child) => {
        if (!child) {
            return;
        }
        // if (typeof child == 'function') {
        //     return child(formSignal);
        // }
        // return child;
        if (child) {
            if (typeof child == 'object') {
                if ('type' in child) {
                    if (child.type == 'input') {
                        console.log(child, child.props.name, child.props.value);
                        child.props.value = getSignal(formSignal, child.props.name);
                    }
                }
            }
        }
    };
    const processChildren = (children) => {
        var _a;
        if (Array.isArray(children)) {
            // let retVal = [];
            for (let child of children) {
                if (child) {
                    processChild(child);
                    if (typeof child == 'object') {
                        if ((_a = child.props) === null || _a === void 0 ? void 0 : _a.children) {
                            processChildren(child.props.children);
                        }
                    }
                }
            }
        }
        else {
            processChild(children);
        }
    };
    useEffect(() => {
        if (p.children) {
            if (Array.isArray(p.children)) {
                processChildren(p.children);
                // for (let child of p.children) {
                // }
            }
        }
    }, [p.children]);
    const onSubmit = useCallback(async (e) => {
        e.preventDefault();
        formState.submitting = true;
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
        let formDataAsObj;
        if (formRef.current) {
            let formData = new FormData(formRef.current);
            let object = {};
            formData.forEach((value, key) => {
                // Reflect.has in favor of: object.hasOwnProperty(key)
                if (!Reflect.has(object, key)) {
                    object[key] = value;
                    return;
                }
                if (!Array.isArray(object[key])) {
                    object[key] = [object[key]];
                }
                object[key].push(value);
            });
            formDataAsObj = JSON.parse(JSON.stringify(object));
        }
        p.onSubmit && await p.onSubmit(e, JSON.parse(JSON.stringify(formSignal)), formSignal, formState, ctx.fieldMap, formDataAsObj);
        formState.submitting = false;
        formState.submitted = true;
        formState.submittedCount = formState.submittedCount + 1;
    }, []);
    const ctx = {
        data: formSignal,
        fieldMap: {},
        ctxState: useDeepSignal({
            count: 0
        }),
        formState: formState
    };
    return (_jsx(SignalFormCtx.Provider, { value: ctx, children: _jsx("form", { ref: formRef, class: p.class, onSubmit: onSubmit, children: p.children }) }));
};
