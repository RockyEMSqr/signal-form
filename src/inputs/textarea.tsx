import { useSignalFormInput } from "../hooks";
import { InputProps } from "../types";

export function TextareaInput<ContainingType = never>(p: InputProps<string, ContainingType>) {
    const { value, onChange, onKeyUp, inputState } = useSignalFormInput<string, ContainingType>(p);
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
            <textarea
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
