import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "preact/jsx-runtime";
import { useSignalFormInput } from "../hooks";
export const NumberInput = (p) => {
    const { ctx, value, onChange } = useSignalFormInput(p);
    return _jsx(_Fragment, { children: _jsx("div", { children: _jsxs("div", { class: 'input-field', children: [_jsxs("div", { class: "icon-wrapper ", children: [_jsx("i", { class: "fa fa-image workspace-icon" }), _jsx("p", { children: p.label })] }), _jsx("input", { type: "number", class: "form-control recital-tool-input-button", value: value, onChange: onChange, id: "todo", placeholder: p.label })] }) }) });
};
