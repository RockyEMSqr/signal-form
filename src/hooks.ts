import { useCallback, useContext, useEffect, useMemo } from "preact/hooks";
import { SignalFormCtx, SignalFormFieldState } from "./context";
import { KeyboardEvent } from "preact/compat";
import { FormState, GenericEvent, InputProps } from "./types";
import { dset, getSignal } from "./utils";
import dlv from 'dlv';
// import { toNestedSignal } from "./form";
import { Signal, useSignal } from "@preact/signals";
import { useDeepSignal } from "deepSignal";
const debug = process?.env?.DEBUG;
export function useSignalForm() {
    const formState = useDeepSignal<FormState>({
        submittedCount: 0,
        submitted: false,
        submitting: false,
    })
    return {
        formState
    }
}
export function useSignalFormInput<T, CO>(p: InputProps<T, CO>) {
    return useMemo(() => {
        const ctx = useContext(SignalFormCtx);
        let mapv = {} as SignalFormFieldState<T>;
        if (p.name) {
            ctx.fieldMap[p.name] = ctx.fieldMap[p.name] || useDeepSignal({ name: p.name, props: p });
            mapv = ctx.fieldMap[p.name];
        }
        // let mapv = useInputState(p.name)
        useEffect(() => {
            if (debug) {
                console.log('Hook use Effect', 'p.name', p.name, 'p.value', p.value, 'dlv val', !p.name ? 'No Name' : dlv(ctx.data, p.name), typeof p.value, ctx.data?.value)
            }

        }, [[p.value]]);

        let inputSignal = useGetInputSignal<T, CO>(p);
        // let inputSignal = p.signal;
        // let valVal = p.value;
        // if (p.signal) {
        //     inputSignal = getSignal(inputSignal, p.name);
        //     if (inputSignal?.value === undefined) {
        //         // if target doesn't have key, make it create it by setting something
        //         //* if not in target put something in there.
        //         dset(inputSignal, p.name, undefined);
        //     }
        // } else {
        //     inputSignal = getSignal(ctx.data, p.name);
        //     // if target doesn't have key, make it create it by setting something
        //     //* if not in target put something in there.
        //     if (inputSignal?.value === undefined) {
        //         dset(ctx.data, p.name, undefined);
        //     }
        // }
        // if (valVal instanceof Signal) {
        //     inputSignal = valVal;
        // }


        mapv.inputSignal = inputSignal!; // <-- 
        let onChange = useCallback((e: GenericEvent<HTMLInputElement>) => {
            if (debug) {
                console.log('BOn Change, ', e, ctx.data);
            }
            mapv.valid = p.validate ? p.validate(inputSignal?.value) : true;
            if (inputSignal) {
                inputSignal.value = e.currentTarget.value as T //TODO: Cast to type T;
            }

            if (p.onChange) {
                p.onChange(e);
            }
            if (debug) {
                console.log('AOn Change, ', ctx.data)
            }
        }, []);
        const onKeyUp = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
            if (debug) {
                console.log('onKeyUp', e);
            }
            if (inputSignal) {
                inputSignal.value = e.currentTarget.value as T;
            }
            p.onKeyUp && p.onKeyUp(e);
        }, []);

        if (!p.id) {
            p.id = `${p.id} ${ctx.ctxState.count++}`;
        }
        const validate = useCallback(() => {
            if (p.validate) {
                return p.validate(inputSignal?.value);
            }
            return true;
        }, [inputSignal]);
        mapv.validate = validate;
        let retVal = {
            ctx,
            // signal: thisInputSignal,
            //if not a signal change value to a signal?
            value: inputSignal,
            onChange,
            onKeyUp,
            inputState: mapv
        };
        if (debug) {
            console.log('useSignalFormInput', retVal);
        }
        return retVal;
    }, []);
}
export function useGetInputSignal<T, CO>(p: InputProps<T, CO>) {
    const ctx = useContext(SignalFormCtx);
    let inputSignal = p.signal;
    let valVal = p.value;
    if (p.name) {
        if (p.signal) {
            inputSignal = getSignal(inputSignal, p.name);
            if (inputSignal?.value === undefined) {
                // if target doesn't have key, make it create it by setting something
                //* if not in target put something in there.
                dset(inputSignal, p.name, undefined);
            }
        } else {
            inputSignal = getSignal(ctx.data, p.name);
            // if target doesn't have key, make it create it by setting something
            //* if not in target put something in there.
            if (inputSignal?.value === undefined) {
                dset(ctx.data, p.name, p.value);
            }
        }
    }
    if (valVal instanceof Signal) {
        inputSignal = valVal;
    }
    if (!inputSignal) {
        inputSignal = useSignal<T>(valVal || '' as any);

        // fixes bug#1
        // set the input signal in the data
        if (p.name) {
            //fixes bug #2 only set if it has a name
            dset(ctx.data, p.name, inputSignal);
        }
    }
    return inputSignal;



}
// export function useGetInputId(p: { id?: string }) {
//     // cuasing overflow probably cause it renders everything that uses count signal, maybe?
//     // const ctx = useContext(SignalFormCtx);
//     // return ctx.ctxState.count++;
// }
// export function useInputState(name: string) {
//     const ctx = useContext(SignalFormCtx);
//     ctx.fieldMap[name] = ctx.fieldMap[name] || useDeepSignal({ name: name });
//     let mapv = ctx.fieldMap[name];
//     return mapv;
// }
// export const ______useSignalFormInput =
//     useCallback(<T>(p: InputProps<T>) => {
//         console.log('init hook', p.name)
//         const ctx = useContext(SignalFormCtx);
//         useEffect(() => {
//             console.log('Hook user Effect', 'p.name', p.name, 'p.value', p.value, 'dlv val', dlv(ctx.signal, p.name), typeof p.value, ctx.signal.value)

//         }, [[p.value]]);
//         let onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
//             console.log('BOn Change, ', ctx.signal)
//             dset(ctx.signal, p.name, e.currentTarget.value);
//             if (p.onChange) {
//                 p.onChange(e);
//             }
//             console.log('AOn Change, ', ctx.signal)
//         }, [])

//         return {
//             ctx,
//             // signal: thisInputSignal,
//             //if not a signal change value to a signal?
//             value: p.value || dlv(ctx.signal, p.name),
//             onChange
//         }
//     }, [])

// <T,>(p: InputProps<T>) => {
//     console.log('init hook', p.name)
//     const ctx = useContext(SignalFormCtx);
//     useEffect(() => {
//         console.log('Hook user Effect', 'p.name', p.name, 'p.value', p.value, 'dlv val', dlv(ctx.signal, p.name), typeof p.value, ctx.signal.value)

//     }, [[p.value]]);
//     let onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
//         console.log('BOn Change, ', ctx.signal)
//         dset(ctx.signal, p.name, e.currentTarget.value);
//         if (p.onChange) {
//             p.onChange(e);
//         }
//         console.log('AOn Change, ', ctx.signal)
//     }, [])

//     return {
//         ctx,
//         // signal: thisInputSignal,
//         //if not a signal change value to a signal?
//         value: p.value || dlv(ctx.signal, p.name),
//         onChange
//     }
// }

// export function useNestedSignal<T extends object>(obj: T) {
//     return useMemo(() => toNestedSignal(obj), []);
// }