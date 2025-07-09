import { useSignalFormInput } from "../hooks";
import { InputProps } from "../types";

export function NumberInput<ContainingType = never>(p: InputProps<number, ContainingType>) {
    const { ctx, value, onChange } = useSignalFormInput(p);
    return <>

        {/* <label for="todo" class="form-label">{p.label}</label> */}
        <input type="number" class={p.class}
            value={value} onChange={onChange}
            id={p.id}
            placeholder={p.label}
            required={p.required}
        />

    </>
}