import { useCallback } from "preact/compat";
import { useSignalFormInput } from "../hooks";
import { GenericEvent, SelectInputProps } from "../types";

export function SelectInput<ContainingType>(p: SelectInputProps<string | string[], ContainingType>) {
    const { value, onChange, onKeyUp, inputState } = useSignalFormInput<string | string[] | { id: string }, ContainingType>(p);
    const {
        label,
        class: className,
        items,
        placeholder,
        multiple,
        onChange: _ignoredOnChange,
        onKeyUp: _ignoredOnKeyUp,
        ...rest
    } = p;

    let oc: (e: GenericEvent<any>) => void = onChange;
    if (multiple) {
        oc = useCallback((e: GenericEvent<HTMLSelectElement>) => {
            const val: string[] = [];
            for (const option of e.currentTarget.options) {
                if (option.selected) {
                    val.push(option.value);
                }
            }
            if (value) {
                value.value = val;
            }
        }, []);
    }

    const classes = [className, inputState?.class].filter(Boolean).join(' ') || undefined;
    const ariaInvalid = inputState?.valid === false ? true : undefined;

    const isSelected = useCallback((x: { value: string | number }) => {
        if (!value) {
            return false;
        }
        if (typeof value.value == 'object' && !Array.isArray(value.value) && (value.value as any)?.id) {
            return (value.value as any).id == x.value;
        }
        if (!x.value) {
            return false;
        }
        return Array.isArray(value?.value)
            ? (value.value as (string | number)[]).includes(x.value)
            : value?.value == x.value;
    }, [value]);

    const hasValue = Array.isArray(value?.value) ? value.value.length > 0 : value?.value !== undefined;

    return (
        <>
            {label && <label for={rest.id}>{label}</label>}
            <select
                {...rest}
                class={classes}
                onChange={oc}
                onKeyUp={onKeyUp}
                multiple={multiple}
                aria-invalid={ariaInvalid}
            >
                {placeholder && (
                    <option value="" selected={!hasValue}>
                        {placeholder}
                    </option>
                )}
                {items.map((x) => (
                    <option key={x.value} selected={isSelected(x)} value={x.value}>
                        {x.label}
                    </option>
                ))}
            </select>
        </>
    );
}
