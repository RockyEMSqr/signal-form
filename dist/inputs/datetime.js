import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "preact/jsx-runtime";
import { useSignal } from "@preact/signals";
import { useGetInputSignal, useSignalFormInput } from "../hooks";
import { useEffect } from "preact/compat";
import { DateTime } from 'luxon';
import { getDT } from "../utils";
export const DateTimeInput = (p) => {
    // const { ctx, value, onChange } = useSignalFormInput(p);
    let value = useGetInputSignal(p);
    value === null || value === void 0 ? void 0 : value.subscribe((v) => {
        console.log('Signal Subscribe', p.name, v);
    });
    const dateSignal = useSignal();
    const timeSignal = useSignal();
    const onDateChange = (e) => {
        dateSignal.value = e.currentTarget.value;
        combineAndCallOnChange();
    };
    const onTimeChange = (e) => {
        timeSignal.value = e.currentTarget.value;
        combineAndCallOnChange();
    };
    let combineAndCallOnChange = () => {
        console.log('Combine the date and time into a Date and call onChange');
        if (dateSignal.value && timeSignal.value) {
            let dt = DateTime.fromJSDate(new Date(dateSignal.value));
            let timeSplit = timeSignal.value.split(':').map(x => Number(x));
            dt = dt.set({ hour: timeSplit[0], minute: timeSplit[1] });
            // value = dt.toJSON();
            //todo(rc): find a better way to call on change
            // @ts-ignore
            // onChange({ currentTarget: { value: dt.toJSON() } })
            value.value = dt.toJSON();
            p.onChange && p.onChange(undefined, dt.toJSDate());
        }
    };
    useEffect(() => {
        if (p.value) {
            let dt = DateTime.fromISO(p.value);
            dateSignal.value = dt.toFormat('yyyy-MM-dd');
            timeSignal.value = dt.toFormat('HH:mm');
        }
    }, [p.value]);
    useEffect(() => {
        console.log('value changed', value);
        if (value) {
            let dt = getDT(value.value);
            // let dt = DateTime.fromISO(value.value);
            dateSignal.value = dt === null || dt === void 0 ? void 0 : dt.toFormat('yyyy-MM-dd');
            timeSignal.value = dt === null || dt === void 0 ? void 0 : dt.toFormat('HH:mm');
        }
    }, [value]);
    return _jsx(_Fragment, { children: _jsxs("div", { children: [_jsx("label", { for: p.name, class: "form-label", children: p.label }), _jsxs("div", { class: 'row width-90', children: [_jsx("div", { class: 'col side-gap', children: _jsxs("div", { class: 'input-field', children: [_jsxs("div", { class: "icon-wrapper", children: [_jsx("i", { class: "fa fa-image workspace-icon" }), _jsx("p", { children: "Date" })] }), _jsx("input", { type: "date", class: "sf-dt df-d", value: dateSignal, onChange: onDateChange, id: p.name })] }) }), _jsx("div", { class: 'col', children: _jsxs("div", { class: 'input-field', children: [_jsxs("div", { class: "icon-wrapper", children: [_jsx("i", { class: "fa fa-image workspace-icon" }), _jsx("p", { children: "Time" })] }), _jsx("input", { type: "time", class: "sf-dt sf-t", value: timeSignal, onKeyUp: e => {
                                            timeSignal.value = e.currentTarget.value;
                                            console.log('time keyup', e);
                                        }, onChange: onTimeChange })] }) })] })] }) });
};
export const DateInput = (p) => {
    const { ctx, value, onChange } = useSignalFormInput(p);
    const dateSignal = useSignal();
    const onDateChange = (e) => {
        dateSignal.value = e.currentTarget.value;
        if (dateSignal.value) {
            const dt = DateTime.fromISO(dateSignal.value);
            onChange({ currentTarget: { value: dt.toISODate() } });
        }
    };
    useEffect(() => {
        if (p.value) {
            const dt = DateTime.fromISO(p.value);
            dateSignal.value = dt.toFormat('yyyy-MM-dd');
        }
    }, [p.value]);
    return (_jsxs("div", { children: [_jsx("label", { htmlFor: p.name, class: "form-label", children: p.label }), _jsxs("div", { class: "input-field", children: [_jsxs("div", { class: "icon-wrapper", children: [_jsx("i", { class: "fa fa-image workspace-icon" }), _jsx("p", { children: "Date" })] }), _jsx("input", { type: "date", class: "form-control recital-tool-input-button1", value: dateSignal, onChange: onDateChange, id: p.name, placeholder: "Date" })] })] }));
};
