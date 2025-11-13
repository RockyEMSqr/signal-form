import { useSignalFormInput } from "../hooks";
import { InputProps } from "../types";

export function NumberInput<ContainingType = never>(p: InputProps<number, ContainingType>) {
    const { value, onChange, onKeyUp, inputState } = useSignalFormInput(p);
    const {
        label,
        class: className,
        onChange: _ignoredOnChange,
        onKeyUp: _ignoredOnKeyUp,
        type,
        ...rest
    } = p;
    const classes = [className, inputState?.class].filter(Boolean).join(' ') || undefined;
    const ariaInvalid = inputState?.valid === false ? true : undefined;

    return (
        <>
            {label && <label for={rest.id}>{label}</label>}
            <input
                {...rest}
                type={type || 'number'}
                class={classes}
                value={value}
                onChange={onChange}
                onKeyUp={onKeyUp}
                aria-invalid={ariaInvalid}
            />
        </>
    );
}
