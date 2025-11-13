import { useSignalFormInput } from "../hooks";
import { InputProps } from "../types";

export function Input<ContainingType = never>(p: InputProps<string, ContainingType>) {
    const { value, onChange, onKeyUp, inputState } = useSignalFormInput(p);
    const {
        label,
        class: className,
        onChange: _ignoredOnChange,
        onKeyUp: _ignoredOnKeyUp,
        ...rest
    } = p;
    const classes = [className, inputState?.class].filter(Boolean).join(' ') || undefined;
    const ariaInvalid = inputState?.valid === false ? true : undefined;

    return (
        <>
            {label && <label for={rest.id}>{label}</label>}
            <input
                {...rest}
                class={classes}
                value={value}
                onChange={onChange}
                onKeyUp={onKeyUp}
                aria-invalid={ariaInvalid}
            />
        </>
    );
}

export function TextInput<ContainingType>(p: InputProps<string, ContainingType>) {
    p.type = 'text';
    return Input(p);
}
