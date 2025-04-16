import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "preact/jsx-runtime";
import { useCallback } from "preact/compat";
import { useSignalFormInput } from "../hooks";
export function SelectInput(p) {
    // export const SelectInput = (p: SelectInputProps<string>) => {
    const { ctx, value, onChange, onKeyUp, inputState } = useSignalFormInput(p);
    // should i just {...p} the props?
    let oc = onChange;
    if (p.multiple) {
        oc = useCallback((e) => {
            let val = [];
            for (let option of e.currentTarget.options) {
                if (option.selected) {
                    val.push(option.value);
                }
            }
            if (value) {
                value.value = val;
            }
        }, []);
    }
    // add class when validation error?
    let classes = [];
    p.class && classes.push(p.class);
    (inputState === null || inputState === void 0 ? void 0 : inputState.class) && classes.push(inputState.class);
    const isSelected = useCallback((x) => {
        return x.value ? Array.isArray(value === null || value === void 0 ? void 0 : value.value) ? value.value.includes(x.value) : (value === null || value === void 0 ? void 0 : value.value) == x.value : false;
    }, [value]);
    return _jsxs(_Fragment, { children: [p.label && _jsx("label", { for: p.id, children: p.label }), _jsxs("select", { 
                // class={classes.join(' ')}
                // value={value}
                onChange: oc, id: p.id, 
                // onKeyUp={onKeyUp}
                multiple: p.multiple, children: [p.placeholder && _jsx("option", { selected: Array.isArray(value === null || value === void 0 ? void 0 : value.value) ? value.value.length === 0 : (value === null || value === void 0 ? void 0 : value.value) == undefined, children: p.placeholder }), p.items.map(x => _jsx("option", { selected: isSelected(x), value: x.value, children: x.label }))] })] });
}
