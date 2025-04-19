import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "preact/jsx-runtime";
import { useSignalFormInput } from "../hooks";
export function Input(p) {
    const { ctx, value, onChange, onKeyUp, inputState } = useSignalFormInput(p);
    // should i just {...p} the props?
    // console.log('Input render', p.name, value);
    let classes = [];
    p.class && classes.push(p.class);
    (inputState === null || inputState === void 0 ? void 0 : inputState.class) && classes.push(inputState.class);
    return _jsxs(_Fragment, { children: [p.label && _jsx("label", { for: p.id, children: p.label }), _jsx("input", { name: p.name, type: p.type, class: classes.join(' '), value: value, onChange: onChange, id: p.id, placeholder: p.placeholder, onKeyUp: onKeyUp })] });
}
export function TextInput(p) {
    p.type = 'text';
    return Input(p);
}
