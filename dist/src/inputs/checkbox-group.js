import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { useSignalFormInput } from "../hooks";
export function CheckboxGroupInput(p) {
    var _a;
    const { value, inputState } = useSignalFormInput(p);
    const classes = [p.class, inputState === null || inputState === void 0 ? void 0 : inputState.class].filter(Boolean).join(' ') || undefined;
    const ariaInvalid = (inputState === null || inputState === void 0 ? void 0 : inputState.valid) === false ? true : undefined;
    const multiple = (_a = p.multiple) !== null && _a !== void 0 ? _a : true;
    const baseId = p.id || p.name || 'checkbox-field';
    const checkboxName = p.name ? (multiple ? `${p.name}[]` : p.name) : undefined;
    const isChecked = (optionValue) => {
        if (!value) {
            return false;
        }
        const currentValue = value.value;
        if (multiple) {
            const list = Array.isArray(currentValue)
                ? currentValue
                : currentValue !== undefined && currentValue !== null
                    ? [currentValue]
                    : [];
            return list.includes(optionValue);
        }
        return currentValue === optionValue;
    };
    const handleToggle = (optionValue, checked) => {
        if (!value) {
            return;
        }
        if (multiple) {
            const current = Array.isArray(value.value)
                ? [...value.value]
                : value.value !== undefined && value.value !== null
                    ? [value.value]
                    : [];
            const next = checked
                ? Array.from(new Set([...current, optionValue]))
                : current.filter((v) => v !== optionValue);
            value.value = next;
            p.onChange && p.onChange(undefined, next);
        }
        else {
            const next = checked ? optionValue : undefined;
            value.value = next;
            p.onChange && p.onChange(undefined, next);
        }
    };
    return (_jsxs("fieldset", { class: classes, "aria-invalid": ariaInvalid, children: [p.label && _jsx("legend", { children: p.label }), p.items.map((item) => {
                const optionId = `${baseId}-${item.value}`;
                return (_jsxs("div", { class: "checkbox-option", children: [_jsx("input", { type: "checkbox", id: optionId, name: checkboxName, value: item.value, checked: isChecked(item.value), onChange: (e) => handleToggle(item.value, e.currentTarget.checked) }), _jsx("label", { for: optionId, children: item.label })] }, item.value));
            })] }));
}
