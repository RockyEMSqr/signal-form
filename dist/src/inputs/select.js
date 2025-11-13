import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "preact/jsx-runtime";
import { useCallback } from "preact/compat";
import { useSignalFormInput } from "../hooks";
export function SelectInput(p) {
    const { value, onChange, onKeyUp, inputState } = useSignalFormInput(p);
    const { label, class: className, items, placeholder, multiple, onChange: _ignoredOnChange, onKeyUp: _ignoredOnKeyUp, ...rest } = p;
    let oc = onChange;
    if (multiple) {
        oc = useCallback((e) => {
            const val = [];
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
    const classes = [className, inputState === null || inputState === void 0 ? void 0 : inputState.class].filter(Boolean).join(' ') || undefined;
    const ariaInvalid = (inputState === null || inputState === void 0 ? void 0 : inputState.valid) === false ? true : undefined;
    const isSelected = useCallback((x) => {
        var _a;
        if (!value) {
            return false;
        }
        if (typeof value.value == 'object' && !Array.isArray(value.value) && ((_a = value.value) === null || _a === void 0 ? void 0 : _a.id)) {
            return value.value.id == x.value;
        }
        if (!x.value) {
            return false;
        }
        return Array.isArray(value === null || value === void 0 ? void 0 : value.value)
            ? value.value.includes(x.value)
            : (value === null || value === void 0 ? void 0 : value.value) == x.value;
    }, [value]);
    const hasValue = Array.isArray(value === null || value === void 0 ? void 0 : value.value) ? value.value.length > 0 : (value === null || value === void 0 ? void 0 : value.value) !== undefined;
    return (_jsxs(_Fragment, { children: [label && _jsx("label", { for: rest.id, children: label }), _jsxs("select", { ...rest, class: classes, onChange: oc, onKeyUp: onKeyUp, multiple: multiple, "aria-invalid": ariaInvalid, children: [placeholder && (_jsx("option", { value: "", selected: !hasValue, children: placeholder })), items.map((x) => (_jsx("option", { selected: isSelected(x), value: x.value, children: x.label }, x.value)))] })] }));
}
