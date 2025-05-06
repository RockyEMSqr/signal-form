import { useSignal } from "@preact/signals";
import { DateInput, DateTimeInput, NumberInput, SignalForm, TextInput } from "../../../src";
type AType = {
    x: number,
    dt: Date,
    name: string
}
export function Example2() {
    const data = useSignal<AType>({
        dt: new Date(),
        name: 'Test Name',
        x: 10
    })
    return <>
        <SignalForm onSubmit={(e, submittedData) => {
            console.log(e, submittedData);
        }} signal={data}>
            <DateTimeInput class="a-class" />
            <div><TextInput<AType> label="Name" name="name" /></div>
            <div><DateInput<AType> label="Date" name="dt" /></div>
            <div><NumberInput<AType> label="X" name="x" /></div>
            <button>Submit</button>
        </SignalForm>
    </>
}