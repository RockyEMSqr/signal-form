import { TargetedEvent, useCallback } from "preact/compat";
import { useSignalFormInput } from "../hooks";
import { GenericEvent, SelectInputProps } from "../types";


export const SelectInput = (p: SelectInputProps<string>) => {
    const { ctx, value, onChange, onKeyUp, inputState } = useSignalFormInput<string | string[]>(p)
    // should i just {...p} the props?
    let oc: (e: GenericEvent<any>) => void = onChange;
    if (p.multiple) {
        oc = useCallback((e: GenericEvent<HTMLSelectElement>) => {
            let val = [];
            for (let option of e.currentTarget.options) {
                if (option.selected) {
                    val.push(option.value)
                }
            }
            if (value) {
                value.value = val;
            }
        }, [])
    }
    // add class when validation error?
    let classes: string[] = [];
    p.class && classes.push(p.class);
    inputState?.class && classes.push(inputState.class);
    const isSelected = useCallback((x: { value: string | number }) => {
        return x.value ? Array.isArray(value?.value) ? value.value.includes(x.value) : value?.value == x.value : false;
    }, [value])
    return <>
        {p.label && <label for={p.id}>{p.label}</label>}
        <select
            // class={classes.join(' ')}
            // value={value}
            onChange={oc}
            id={p.id}
            // onKeyUp={onKeyUp}
            multiple={p.multiple}
        >
            {p.placeholder && <option selected={Array.isArray(value?.value) ? value.value.length === 0 : value?.value == undefined}>{p.placeholder}</option>}
            {/* selected={value?.value?.includes(x.value)} */}
            {p.items.map(x => <option selected={isSelected(x)} value={x.value}>{x.label}</option>)}
        </select>
    </>
}