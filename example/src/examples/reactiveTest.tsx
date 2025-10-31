import { signal, Signal, useSignal } from "@preact/signals";
import { Input, SignalForm, WYSIWYGInput } from "../../../src";
import { useEffect } from "preact/hooks";
import { useDeepSignal } from "deepsignal";



export function ReactiveTest() {
    const data = useSignal({ a: 1 });
    useEffect(() => {
        let id = setInterval(() => {

            data.value.a = Date.now();
            console.log('tick', data.value.a);
            data.value = { ...data.value } // trigger
        }, 1000)
        return () => {
            clearInterval(id);
        }
    }, [])
    return <><SignalForm signal={data}>
        {Array.from({ length: 1000 }, (_, index) => (
            <Input key={index} name={`a${index}`} />
        ))}
        <Input name="a" />
    </SignalForm>

        <div>{data.value.a}</div>
    </>
}