import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "preact/jsx-runtime";
import { useSignal } from "@preact/signals";
import { useSignalFormInput } from "../hooks";
import { useEffect } from "preact/compat";
import { DateTime } from 'luxon';
import { getDT } from "../utils";
export function DateTimeInput(p) {
    var _a;
    const { value, inputState, onChange } = useSignalFormInput(p);
    const dateSignal = useSignal('');
    const timeSignal = useSignal('');
    const timezone = p.timezone || 'local';
    const ariaInvalid = (inputState === null || inputState === void 0 ? void 0 : inputState.valid) === false ? true : undefined;
    const classes = [p.class, inputState === null || inputState === void 0 ? void 0 : inputState.class].filter(Boolean).join(' ') || undefined;
    const dateInputId = `${p.id}-date`;
    const timeInputId = `${p.id}-time`;
    useEffect(() => {
        if (!value) {
            return;
        }
        const syncFromSignal = (v) => {
            var _a;
            if (!v) {
                return;
            }
            const dt = (_a = getDT(v)) === null || _a === void 0 ? void 0 : _a.setZone(timezone, { keepLocalTime: true });
            dateSignal.value = (dt === null || dt === void 0 ? void 0 : dt.toFormat('yyyy-MM-dd')) || '';
            timeSignal.value = (dt === null || dt === void 0 ? void 0 : dt.toFormat('HH:mm')) || '';
        };
        syncFromSignal(value.value);
        const dispose = value.subscribe(syncFromSignal);
        return () => {
            dispose();
        };
    }, [value, timezone]);
    const onDateChange = (e) => {
        dateSignal.value = e.currentTarget.value;
        combineAndCallOnChange();
    };
    const onTimeChange = (e) => {
        timeSignal.value = e.currentTarget.value;
        combineAndCallOnChange();
    };
    const emitSyntheticChange = (nextValue, jsDate) => {
        const syntheticEvent = {
            currentTarget: { value: nextValue },
            target: { value: nextValue }
        };
        const originalOnChange = p.onChange;
        p.onChange = undefined;
        onChange(syntheticEvent);
        p.onChange = originalOnChange;
        originalOnChange && originalOnChange(syntheticEvent, jsDate);
    };
    let combineAndCallOnChange = () => {
        if (!value) {
            return;
        }
        if (dateSignal.value && timeSignal.value) {
            let dt = DateTime.fromISO(dateSignal.value).setZone(timezone, { keepLocalTime: true });
            const timeSplit = timeSignal.value.split(':').map(x => Number(x));
            dt = dt.set({ hour: timeSplit[0], minute: timeSplit[1] });
            const nextValue = dt.toISO({ includeOffset: true, suppressMilliseconds: true });
            emitSyntheticChange(nextValue, dt.toJSDate());
        }
    };
    useEffect(() => {
        if (!p.value) {
            return;
        }
        let dt;
        if (typeof p.value === 'string') {
            dt = DateTime.fromISO(p.value);
        }
        else if (p.value instanceof Date) {
            dt = DateTime.fromJSDate(p.value);
        }
        if (!(dt === null || dt === void 0 ? void 0 : dt.isValid)) {
            return;
        }
        dt = dt.setZone(timezone, { keepLocalTime: true });
        dateSignal.value = dt.toFormat('yyyy-MM-dd');
        timeSignal.value = dt.toFormat('HH:mm');
    }, [p.value, timezone]);
    return _jsxs(_Fragment, { children: [_jsxs("div", { class: 'row', "aria-invalid": ariaInvalid, children: [p.label && _jsx("label", { for: dateInputId, children: p.label }), _jsxs("div", { class: 'col-6', children: [p.dateLabel && _jsx("label", { for: dateInputId, children: p.dateLabel }), _jsx("input", { type: "date", class: classes, value: dateSignal, onChange: onDateChange, id: dateInputId, required: p.required, "aria-invalid": ariaInvalid })] }), _jsxs("div", { class: 'col-6', children: [p.timeLabel && _jsx("label", { for: timeInputId, children: p.timeLabel }), _jsx("input", { type: "time", class: classes, value: timeSignal, onKeyUp: e => {
                                    timeSignal.value = e.currentTarget.value;
                                }, onChange: onTimeChange, id: timeInputId, required: p.required, "aria-invalid": ariaInvalid })] })] }), p.name && _jsx("input", { type: "hidden", name: p.name, value: ((_a = value === null || value === void 0 ? void 0 : value.value) === null || _a === void 0 ? void 0 : _a.valueOf()) || '' })] });
}
export function DateInput(p) {
    const { value, onChange, inputState } = useSignalFormInput(p);
    const dateSignal = useSignal('');
    const timezone = p.timezone || 'local';
    const classes = [p.class, inputState === null || inputState === void 0 ? void 0 : inputState.class].filter(Boolean).join(' ') || undefined;
    const ariaInvalid = (inputState === null || inputState === void 0 ? void 0 : inputState.valid) === false ? true : undefined;
    const syncSignal = (incoming) => {
        if (!incoming) {
            dateSignal.value = '';
            return;
        }
        let dt;
        if (incoming instanceof Date) {
            dt = DateTime.fromJSDate(incoming);
        }
        else if (typeof incoming === 'string') {
            dt = DateTime.fromISO(incoming);
        }
        if (!(dt === null || dt === void 0 ? void 0 : dt.isValid)) {
            return;
        }
        const zoned = dt.setZone(timezone, { keepLocalTime: true });
        dateSignal.value = zoned.toFormat('yyyy-MM-dd');
    };
    const onDateChange = (e) => {
        dateSignal.value = e.currentTarget.value;
        if (dateSignal.value) {
            let dt = DateTime.fromISO(dateSignal.value).setZone(timezone, { keepLocalTime: true });
            const syntheticEvent = {
                currentTarget: { value: dt.toISO() },
                target: { value: dt.toISO() }
            };
            onChange(syntheticEvent);
        }
        else {
            const syntheticEvent = {
                currentTarget: { value: '' },
                target: { value: '' }
            };
            // handle clear button
            onChange(syntheticEvent);
        }
    };
    useEffect(() => {
        if (p.value) {
            syncSignal(p.value);
        }
    }, [p.value, timezone]);
    useEffect(() => {
        if (!value) {
            return;
        }
        const currentValue = value.value;
        if (!currentValue) {
            dateSignal.value = '';
            return;
        }
        syncSignal(currentValue);
    }, [value, timezone]);
    return (_jsxs(_Fragment, { children: [p.label && _jsx("label", { for: p.id, children: p.label }), _jsx("input", { type: "date", class: classes, value: dateSignal, onChange: onDateChange, name: p.name, id: p.id, placeholder: p.placeholder || "Date", required: p.required, min: p.min, max: p.max, "aria-invalid": ariaInvalid })] }));
}
;
