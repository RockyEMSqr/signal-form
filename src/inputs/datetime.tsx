import { useSignal } from "@preact/signals";
import { useSignalFormInput } from "../hooks";
import { InputProps } from "../types";
import { ChangeEvent, useEffect } from "preact/compat";
import { DateTime } from 'luxon'
import { getDT } from "../utils";

export function DateTimeInput<ContainingType = never>(p: InputProps<string | Date, ContainingType> & { timezone?: string, dateLabel?: string, timeLabel?: string }) {
    const { value, inputState, onChange } = useSignalFormInput<string | Date, ContainingType>(p);
    const dateSignal = useSignal<string>('');
    const timeSignal = useSignal<string>('');
    const timezone = p.timezone || 'local';
    const ariaInvalid = inputState?.valid === false ? true : undefined;
    const classes = [p.class, inputState?.class].filter(Boolean).join(' ') || undefined;
    const dateInputId = `${p.id}-date`;
    const timeInputId = `${p.id}-time`;

    useEffect(() => {
        if (!value) {
            return;
        }
        const syncFromSignal = (v: string | Date | undefined) => {
            if (!v) {
                return;
            }
            const dt = getDT(v)?.setZone(timezone, { keepLocalTime: true });
            dateSignal.value = dt?.toFormat('yyyy-MM-dd') || '';
            timeSignal.value = dt?.toFormat('HH:mm') || '';
        };
        syncFromSignal(value.value);
        const dispose = value.subscribe(syncFromSignal);
        return () => {
            dispose();
        };
    }, [value, timezone]);

    const onDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        dateSignal.value = e.currentTarget.value;
        combineAndCallOnChange();
    }
    const onTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
        timeSignal.value = e.currentTarget.value;
        combineAndCallOnChange();
    }
    const emitSyntheticChange = (nextValue: string, jsDate?: Date) => {
        const syntheticEvent = {
            currentTarget: { value: nextValue },
            target: { value: nextValue }
        } as ChangeEvent<HTMLInputElement>;
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

            const nextValue = dt.toJSON();
            emitSyntheticChange(nextValue, dt.toJSDate());
        }
    }
    useEffect(() => {
        if (!p.value) {
            return;
        }
        let dt: DateTime | undefined;
        if (typeof p.value === 'string') {
            dt = DateTime.fromISO(p.value);
        } else if (p.value instanceof Date) {
            dt = DateTime.fromJSDate(p.value);
        }
        if (!dt?.isValid) {
            return;
        }
        dt = dt.setZone(timezone, { keepLocalTime: true });
        dateSignal.value = dt.toFormat('yyyy-MM-dd');
        timeSignal.value = dt.toFormat('HH:mm');
    }, [p.value, timezone])
    return <>
        <div class='row' aria-invalid={ariaInvalid}>
            {p.label && <label for={dateInputId}>{p.label}</label>}
            <div class='col-6'>
                {p.dateLabel && <label for={dateInputId}>{p.dateLabel}</label>}

                <input type="date" class={classes}
                    value={dateSignal}
                    onChange={onDateChange}
                    id={dateInputId}
                    required={p.required}
                    aria-invalid={ariaInvalid}
                />
            </div>
            <div class='col-6'>
                {p.timeLabel && <label for={timeInputId}>{p.timeLabel}</label>}
                <input type="time" class={classes}
                    value={timeSignal} onKeyUp={e => {
                        timeSignal.value = e.currentTarget.value;
                    }}
                    onChange={onTimeChange}
                    id={timeInputId}
                    required={p.required}
                    aria-invalid={ariaInvalid}
                />
            </div>
        </div>
        {p.name && <input type="hidden" name={p.name} value={value?.value || ''} />}
    </>
}
type DateOrString = Date | string;
export function DateInput<ContainingType = never>(p: InputProps<Date | string, ContainingType> & { timezone?: string }) {
    const { value, onChange, inputState } = useSignalFormInput<DateOrString, ContainingType>(p);
    const dateSignal = useSignal<string>('');
    const timezone = p.timezone || 'local';
    const classes = [p.class, inputState?.class].filter(Boolean).join(' ') || undefined;
    const ariaInvalid = inputState?.valid === false ? true : undefined;

    const syncSignal = (incoming?: DateOrString) => {
        if (!incoming) {
            dateSignal.value = '';
            return;
        }
        let dt: DateTime | undefined;
        if (incoming instanceof Date) {
            dt = DateTime.fromJSDate(incoming);
        } else if (typeof incoming === 'string') {
            dt = DateTime.fromISO(incoming);
        }
        if (!dt?.isValid) {
            return;
        }
        const zoned = dt.setZone(timezone, { keepLocalTime: true });
        dateSignal.value = zoned.toFormat('yyyy-MM-dd');
    };
    const onDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        dateSignal.value = e.currentTarget.value;
        if (dateSignal.value) {
            let dt = DateTime.fromISO(dateSignal.value).setZone(timezone, { keepLocalTime: true });
            onChange({ currentTarget: { value: dt.toISO()! } });
        } else {
            // handle clear button
            onChange({ currentTarget: { value: '' } });
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
        const currentValue = value.value as DateOrString | undefined;
        if (!currentValue) {
            dateSignal.value = '';
            return;
        }
        syncSignal(currentValue);
    }, [value, timezone]);

    return (<>
        {p.label && <label for={p.id}>{p.label}</label>}
        <input
            type="date"
            class={classes}
            value={dateSignal}
            onChange={onDateChange}
            name={p.name}
            id={p.id}
            placeholder={p.placeholder || "Date"}
            required={p.required}
            min={p.min}
            max={p.max}
            aria-invalid={ariaInvalid}
        />

    </>
    );
};
