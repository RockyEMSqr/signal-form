import { useCallback, useContext, useEffect, useMemo } from "preact/hooks";
import { SignalFormCtx } from "./context";
import { ChangeEvent } from "preact/compat";
import { InputProps } from "./types";
import { dset } from "./utils";
import dlv from 'dlv';
export const useSignalFormInput = <T,>(p: InputProps<T>) => {
    console.log('init hook', p.name)
    const ctx = useContext(SignalFormCtx);
    useEffect(() => {
        console.log('Hook user Effect', 'p.name', p.name, 'p.value', p.value, 'dlv val', dlv(ctx.signal, p.name), typeof p.value, ctx.signal.value)

    }, [[p.value]]);
    let onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        console.log('BOn Change, ', ctx.signal)
        dset(ctx.signal, p.name, e.currentTarget.value);
        if (p.onChange) {
            p.onChange(e);
        }
        console.log('AOn Change, ', ctx.signal)
    }, [])

    return {
        ctx,
        // signal: thisInputSignal,
        value: p.value || dlv(ctx.signal, p.name),
        onChange
    }
}