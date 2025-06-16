import { jsx as _jsx, Fragment as _Fragment } from "preact/jsx-runtime";
import { useSignalFormInput } from "../hooks";
export function NumberInput(p) {
    const { ctx, value, onChange } = useSignalFormInput(p);
    return _jsx(_Fragment, { children: _jsx("input", { type: "number", class: p.class, value: value, onChange: onChange, id: "todo", placeholder: p.label }) });
}
