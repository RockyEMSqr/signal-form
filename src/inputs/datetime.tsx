import { useSignal } from "@preact/signals";
import { useGetInputSignal, useSignalFormInput } from "../hooks";
import { InputProps } from "../types";
import { ChangeEvent, useEffect } from "preact/compat";
import { DateTime } from 'luxon'
import { getDT } from "../utils";
export const DateTimeInput = (p: InputProps<string | Date>) => {
    // const { ctx, value, onChange } = useSignalFormInput(p);
    let value = useGetInputSignal(p);
    value?.subscribe((v) => {
        console.log('Signal Subscribe', p.name, v);
    })
    const dateSignal = useSignal<string>();
    const timeSignal = useSignal<string>();
    const onDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        dateSignal.value = e.currentTarget.value;
        combineAndCallOnChange();
    }
    const onTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
        timeSignal.value = e.currentTarget.value;
        combineAndCallOnChange();
    }
    let combineAndCallOnChange = () => {
        console.log('Combine the date and time into a Date and call onChange')
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
    }
    useEffect(() => {
        if (p.value) {
            let dt = DateTime.fromISO(p.value);
            dateSignal.value = dt.toFormat('yyyy-MM-dd');
            timeSignal.value = dt.toFormat('HH:mm')
        }
    }, [p.value])
    useEffect(() => {
        console.log('value changed', value);
        if (value) {
            let dt = getDT(value.value)
            // let dt = DateTime.fromISO(value.value);
            dateSignal.value = dt?.toFormat('yyyy-MM-dd');
            timeSignal.value = dt?.toFormat('HH:mm')
        }
    }, [value])
    return <>
        <div>
            <label for={p.name} class="form-label">{p.label}</label>
            <div class='row width-90'>
                <div class='col side-gap'>
                    <div class='input-field'>
                        <div class="icon-wrapper">
                            <i class="fa fa-image workspace-icon"></i>
                            {/* <p>{p.label}</p>  */}
                            <p>Date</p>
                        </div>
                        <input type="date" class="sf-dt df-d" value={dateSignal} onChange={onDateChange} id={p.name} />
                    </div>
                </div>

                <div class='col'>
                    {/* <label>{p.label}</label> */}
                    <div class='input-field'>
                        <div class="icon-wrapper">
                            <i class="fa fa-image workspace-icon"></i>
                            {/* <p>{p.label}</p> */}
                            <p>Time</p>
                        </div>

                        <input type="time" class="sf-dt sf-t"
                            value={timeSignal} onKeyUp={e => {
                                timeSignal.value = e.currentTarget.value;
                                console.log('time keyup', e)
                            }} onChange={onTimeChange} />
                    </div>
                </div>
            </div>
        </div>
    </>
}
type DateOrString = Date | string;
export function DateInput<ContainingType = never>(p: InputProps<Date | string>) {
    const { ctx, value, onChange } = useSignalFormInput<DateOrString, ContainingType>(p);
    const dateSignal = useSignal<string>();

    const onDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        dateSignal.value = e.currentTarget.value;

        if (dateSignal.value) {
            const dt = DateTime.fromISO(dateSignal.value);
            onChange({ currentTarget: { value: dt.toISODate()! } });
        }
    };

    useEffect(() => {
        if (p.value) {
            if (typeof p.value == "string") {
                // assume string in iso format
                const dt = DateTime.fromISO(p.value);
                dateSignal.value = dt.toFormat('yyyy-MM-dd');
            }
        }
    }, [p.value]);
    useEffect(() => {
        if (value.value as any instanceof Date) {
            const dt = DateTime.fromJSDate(value.value as Date);
            dateSignal.value = dt.toFormat('yyyy-MM-dd');
        }
    }, [value])

    return (<>
        {p.label && <label for={p.id}>{p.label}</label>}
        <input
            type="date"
            class={p.class}
            value={dateSignal}
            onChange={onDateChange}
            id={p.id}
            placeholder="Date"
        />

    </>
    );
};
