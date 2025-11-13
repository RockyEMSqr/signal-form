import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "preact/jsx-runtime";
import { useSignalFormInput } from "../hooks";
export function TextareaInput(p) {
    const { value, onChange, onKeyUp, inputState } = useSignalFormInput(p);
    const { label, class: className, onChange: _ignoredOnChange, onKeyUp: _ignoredOnKeyUp, ...rest } = p;
    const classes = [className, inputState === null || inputState === void 0 ? void 0 : inputState.class].filter(Boolean).join(' ') || undefined;
    const ariaInvalid = (inputState === null || inputState === void 0 ? void 0 : inputState.valid) === false ? true : undefined;
    return (_jsxs(_Fragment, { children: [label && _jsx("label", { for: rest.id, children: label }), _jsx("textarea", { ...rest, class: classes, value: value, onChange: onChange, onKeyUp: onKeyUp, "aria-invalid": ariaInvalid })] }));
}
