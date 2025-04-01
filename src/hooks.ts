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
        ctx.fieldMap[p.name] = ctx.fieldMap[p.name] || useDeepSignal({ name: p.name, props: p });
        let mapv = ctx.fieldMap[p.name]
        useEffect(() => {
            console.log('Hook use Effect', 'p.name', p.name, 'p.value', p.value, 'dlv val', dlv(ctx.data, p.name), typeof p.value, ctx.data.value)

        }, [[p.value]]);


        let inputSignal = p.signal;
        let valVal = p.value;
        if (p.signal) {
            valVal = getSignal(inputSignal, p.name);
            if (valVal?.value === undefined) {
                // if target doesn't have key, make it create it by setting something
                //* if not in target put something in there.
                dset(inputSignal, p.name, undefined);
            }
        } else {
            valVal = getSignal(ctx.data, p.name);
            // if target doesn't have key, make it create it by setting something
            //* if not in target put something in there.
            if (valVal?.value === undefined) {
                dset(ctx.data, p.name, undefined);
            }
        }
        if (valVal instanceof Signal) {
            inputSignal = valVal;
        } else {
            // todo: never hits here

        }


        mapv.signal = inputSignal;
        let onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
            console.log('BOn Change, ', ctx.data);
            mapv.valid = p.validate ? p.validate(inputSignal?.value) : true;
            inputSignal.value = e.currentTarget.value;

            if (p.onChange) {
                p.onChange(e);
            }
            console.log('AOn Change, ', ctx.data)
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