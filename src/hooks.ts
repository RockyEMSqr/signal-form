import { useCallback, useContext, useEffect, useMemo } from "preact/hooks";
import { SignalFormCtx } from "./context";
import { ChangeEvent } from "preact/compat";
import { InputProps } from "./types";
import { dlvSignal, dlvDeepSignal, dset, dsetSignal, getSignal } from "./utils";
import dlv from 'dlv';
// import { toNestedSignal } from "./form";
import { Signal, useSignal } from "@preact/signals";
import { useDeepSignal } from "deepsignal";
export function useSignalFormInput<T>(p: InputProps<T>) {
    return useMemo(() => {
        console.log('init hook', p.name)
        const ctx = useContext(SignalFormCtx);
        useEffect(() => {
            console.log('Hook use Effect', 'p.name', p.name, 'p.value', p.value, 'dlv val', dlv(ctx.signal, p.name), typeof p.value, ctx.signal.value)

        }, [[p.value]]);


        let inputSignal = p.signal;
        let valVal = p.value;
        if (p.signal) {
            valVal = getSignal(inputSignal, p.name);
        } else {
            valVal = getSignal(ctx.signal, p.name);
        }
        if (valVal instanceof Signal) {
            inputSignal = valVal;
        } else {
            // todo: never hits here

        }
        // dset(ctx.signal, p.name, inputSignal);
        // ctx.signal[p.name] = inputSignal;

        // dsetSignal(ctx.signal, p.name, inputSignal);
        // dset(ctx.signal, '$' + p.name, inputSignal);

        let onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
            console.log('BOn Change, ', ctx.signal);
            inputSignal.value = e.currentTarget.value;
            if (p.onChange) {
                p.onChange(e);
            }
            console.log('AOn Change, ', ctx.signal)
        }, []);
        const onKeyUp = useCallback((e: ChangeEvent<HTMLInputElement>) => {
            console.log('onKeyUp', e);
            inputSignal.value = e.currentTarget.value;
            p.onKeyUp && p.onKeyUp(e);
        }, [])
        let retVal = {
            ctx,
            // signal: thisInputSignal,
            //if not a signal change value to a signal?
            value: inputSignal,
            onChange,
            onKeyUp
        };
        console.log('useSignalFormInput', retVal);
        return retVal;
    }, []);
}
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