import { useSignalFormInput } from "../hooks";
import { InputProps, LabelValue } from "../types";

export type CheckboxGroupInputProps<ValueType extends string | number, ContainingType> =
    InputProps<ValueType[] | ValueType, ContainingType> & {
        items: LabelValue[];
        multiple?: boolean;
    };

export function CheckboxGroupInput<ValueType extends string | number = string, ContainingType = never>(
    p: CheckboxGroupInputProps<ValueType, ContainingType>
) {
    const { value, inputState } = useSignalFormInput<ValueType[] | ValueType, ContainingType>(p);
    const classes = [p.class, inputState?.class].filter(Boolean).join(' ') || undefined;
    const ariaInvalid = inputState?.valid === false ? true : undefined;
    const multiple = p.multiple ?? true;
    const baseId = p.id || p.name || 'checkbox-field';
    const checkboxName = p.name ? (multiple ? `${p.name}[]` : p.name) : undefined;

    const isChecked = (optionValue: ValueType) => {
        if (!value) {
            return false;
        }
        const currentValue = value.value;
        if (multiple) {
            const list = Array.isArray(currentValue)
                ? currentValue
                : currentValue !== undefined && currentValue !== null
                    ? [currentValue as ValueType]
                    : [];
            return list.includes(optionValue);
        }
        return currentValue === optionValue;
    };

    const handleToggle = (optionValue: ValueType, checked: boolean) => {
        if (!value) {
            return;
        }
        if (multiple) {
            const current = Array.isArray(value.value)
                ? [...value.value]
                : value.value !== undefined && value.value !== null
                    ? [value.value as ValueType]
                    : [];
            const next = checked
                ? Array.from(new Set([...current, optionValue]))
                : current.filter((v) => v !== optionValue);
            value.value = next as any;
            p.onChange && p.onChange(undefined as any, next);
        } else {
            const next = checked ? optionValue : undefined;
            value.value = next as any;
            p.onChange && p.onChange(undefined as any, next);
        }
    };

    return (
        <fieldset class={classes} aria-invalid={ariaInvalid}>
            {p.label && <legend>{p.label}</legend>}
            {p.items.map((item) => {
                const optionId = `${baseId}-${item.value}`;
                return (
                    <div class="checkbox-option" key={item.value}>
                        <input
                            type="checkbox"
                            id={optionId}
                            name={checkboxName}
                            value={item.value}
                            checked={isChecked(item.value as ValueType)}
                            onChange={(e) => handleToggle(item.value as ValueType, e.currentTarget.checked)}
                        />
                        <label for={optionId}>{item.label}</label>
                    </div>
                );
            })}
        </fieldset>
    );
}
