import { useSignal } from "@preact/signals";
import { DateInput, DateTimeInput, Input, NumberInput, SignalForm, TextInput } from "../../../src";
type AType = {
    x: number,
    dt: Date | string,
    name: string
}
export function Example2() {
    const data = useSignal<AType>({
        dt: new Date().toISOString(),
        name: 'Test Name',
        x: 10
    })
    return <>
        <SignalForm<any> onSubmit={(e, submittedData) => {
            console.assert(submittedData.shouldbeThere == "FOOBOO");
            console.log(e, submittedData);
        }} signal={data}>
            <Input type="hidden" name="shouldbeThere" value="FOOBOO" />
            <DateInput name="dateWithTime" />
            {/* <DateInput<AType> label="this one" name="dt" /> */}
            {/* <DateTimeInput class="a-class" /> */}
            {/* <div><TextInput<AType> label="Name" name="name" /></div> */}
            {/* <div><DateInput<AType> label="Date" name="dt" /></div> */}
            {/* <div><NumberInput<AType> label="X" name="x" /></div> */}
            <button>Submit</button>
        </SignalForm>
    </>
}