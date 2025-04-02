import { TargetedEvent, useCallback } from "preact/compat";
import { useSignalFormInput } from "./hooks";
import { LabelChildren } from "./label";
import { InputProps, LabeledSelectInputProps, SelectInputProps } from "./types";


export const SelectInput = (p: SelectInputProps<string>) => {
    const { ctx, value, onChange, onKeyUp, inputState } = useSignalFormInput<string, HTMLSelectElement>(p)
    // should i just {...p} the props?
    // console.log('Input render', p.name, value);
    let oc = () => { };//onChange;
    if (p.multiple) {
        oc = useCallback((e: TargetedEvent<HTMLSelectElement>) => {
            let val = [];
            for (let option of e.currentTarget.options) {
                if (option.selected) {
                    val.push(option.value)
                }
            }
            value.value = val;
        }, [])
    }
    // let classes: string[] = [];
    // p.class && classes.push(p.class);
    // inputState?.class && classes.push(inputState.class);
    console.log('render select', p)
    return <select
        // class={classes.join(' ')}
        // value={value}
        onChange={oc}
        id={p.id}
        // onKeyUp={onKeyUp}
        multiple={p.multiple}
    >
        {p.placeholder && <option selected>{p.placeholder}</option>}
        {/* selected={value?.value?.includes(x.value)} */}
        {p.items.map(x => <option value={x.value}>{x.label}</option>)}
    </select>
}
export function LabeledSelectInput(p: LabeledSelectInputProps<string>) {
    return <>
        <LabelChildren {...p}>
            <SelectInput {...p} />
        </LabelChildren>
    </>
}