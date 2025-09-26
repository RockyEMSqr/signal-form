import { useSignal } from "@preact/signals";
import { DateInput, DateTimeInput, Input, NumberInput, SignalForm, TextInput } from "../../../src";
type AType = {
    x: number,
    dt: Date | string,
    name: string,
    dt2?: Date | string,
    dt1: Date | string,

}
export function DateTimesEx() {
    const postedData = useSignal<any>(null)
    const data = useSignal<AType>({
        dt: new Date().toISOString(),
        name: 'Test Name',
        x: 10,
        dt1: new Date().toISOString(),
        dt2: new Date('2025-12-21T17:00:00.000Z'),
    })
    return <>
        <SignalForm<any> onSubmit={(e, submittedData) => {
            console.assert(submittedData.shouldbeThere == "FOOBOO");
            console.log(e, submittedData);
            postedData.value = submittedData;
        }} signal={data}>
            <Input type="hidden" name="shouldbeThere" value="FOOBOO" />
            <DateInput name="dateWithTime" />
            <DateTimeInput name="dateWithTimeGiven" />

            <div>
                <h1>Dt1</h1>
                <DateTimeInput<AType> label="Us Eastern" timezone="US/Eastern" name="dt1" />
                <DateTimeInput<AType> label="Central" timezone="US/Central" name="dt1" />
                <DateTimeInput<AType> label="Mountain" timezone="US/Mountain" name="dt1" />
                <DateTimeInput<AType> label="Pacific" timezone="US/Pacific" name="dt1" />
            </div>
            <div>
                <h1>Dt2</h1>
                <DateTimeInput<AType> label="Us Eastern" timezone="US/Eastern" name="dt2" />
                <DateTimeInput<AType> label="Central" timezone="US/Central" name="dt2" />
                <DateTimeInput<AType> label="Mountain" timezone="US/Mountain" name="dt2" />
                <DateTimeInput<AType> label="Pacific" timezone="US/Pacific" name="dt2" />
            </div>

            {/* <DateInput<AType> label="this one" name="dt" /> */}
            {/* <DateTimeInput class="a-class" /> */}
            {/* <div><TextInput<AType> label="Name" name="name" /></div> */}
            {/* <div><DateInput<AType> label="Date" name="dt" /></div> */}
            {/* <div><NumberInput<AType> label="X" name="x" /></div> */}
            <button>Submit</button>
        </SignalForm>
        <pre>
            {JSON.stringify(postedData, null, '  ')}
        </pre>
    </>
}