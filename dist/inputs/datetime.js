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
            let dt = DateTime.fromISO(dateSignal.value).setZone(p.timezone || 'local', { keepLocalTime: true });
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
            let dt = DateTime.fromISO(p.value).setZone(p.timezone || 'local', { keepLocalTime: true });
            dateSignal.value = dt.toFormat('yyyy-MM-dd');
            timeSignal.value = dt.toFormat('HH:mm');
        }
    }, [p.value]);
    useEffect(() => {
        var _a;
        console.log('value changed', value);
        if (value) {
            let dt = (_a = getDT(value.value)) === null || _a === void 0 ? void 0 : _a.setZone(p.timezone || 'local', { keepLocalTime: true });
            // let dt = DateTime.fromISO(value.value);
            dateSignal.value = dt === null || dt === void 0 ? void 0 : dt.toFormat('yyyy-MM-dd');
            timeSignal.value = dt === null || dt === void 0 ? void 0 : dt.toFormat('HH:mm');
        }
    }, [value]);
    return _jsx(_Fragment, { children: _jsxs("div", { class: 'row', children: [_jsxs("div", { class: 'col', children: [p.label && _jsx("label", { for: p.name, class: "form-label", children: p.label }), _jsx("input", { type: "date", class: p.class, value: dateSignal, onChange: onDateChange, id: p.name, required: p.required })] }), _jsxs("div", { class: 'col', children: [_jsx("label", { children: "Time" }), _jsx("input", { type: "time", class: p.class, value: timeSignal, onKeyUp: e => {
                                timeSignal.value = e.currentTarget.value;
                            }, onChange: onTimeChange, required: p.required })] })] }) });
};
export function DateInput(p) {
    const { ctx, value, onChange } = useSignalFormInput(p);
    const dateSignal = useSignal();
    const onDateChange = (e) => {
        dateSignal.value = e.currentTarget.value;
        if (dateSignal.value) {
            let dt = DateTime.fromISO(dateSignal.value).setZone(p.timezone || 'local', { keepLocalTime: true });
            onChange({ currentTarget: { value: dt.toISO() } });
        }
        else {
            // handle clear button
            onChange({ currentTarget: { value: '' } });
        }
    };
    useEffect(() => {
        if (p.value) {
            if (typeof p.value == "string") {
                // assume string in iso format
                const dt = DateTime.fromISO(p.value).setZone(p.timezone || 'local', { keepLocalTime: true });
                dateSignal.value = dt.toFormat('yyyy-MM-dd');
            }
        }
    }, [p.value]);
    useEffect(() => {
        if (value.value instanceof Date) {
            const dt = DateTime.fromJSDate(value.value).setZone(p.timezone || 'local', { keepLocalTime: true });
            dateSignal.value = dt.toFormat('yyyy-MM-dd');
        }
        else if (typeof value.value == "string") {
            // assume string in iso format
            const dt = DateTime.fromISO(value.value).setZone(p.timezone || 'local', { keepLocalTime: true });
            dateSignal.value = dt.toFormat('yyyy-MM-dd');
        }
    }, [value]);
    return (_jsxs(_Fragment, { children: [p.label && _jsx("label", { for: p.id, children: p.label }), _jsx("input", { type: "date", class: p.class, value: dateSignal, onChange: onDateChange, id: p.id, placeholder: "Date", required: p.required, min: p.min, max: p.max })] }));
}
;
