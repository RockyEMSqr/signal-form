import { useSignal } from "@preact/signals";
import { SignalForm, TextInput, useSignalForm } from "../../../src";

export function FormStateTinker() {
    let formHook = useSignalForm();
    const data = useSignal<any>();
    return <>
        <SignalForm {...formHook} onSubmit={async (e, d, ds, forminfo) => {
            console.log(JSON.stringify(forminfo), forminfo == formHook.formState, e, d, ds)
            return new Promise((res, rej) => {
                setTimeout(() => {
                    data.value = { ...d };
                    res();
                }, 1000)
            })
        }}>

            <TextInput name="test" />
            {!formHook.formState.submitting && <button>Submit</button>}
            {formHook.formState.submitting && <span>Submitting</span>}
            {/* <div>Submitted Count: {formHook.formState.$submittedCount}</div> */}
            <h2>State</h2>
            <pre>
                {JSON.stringify(formHook.formState)}
            </pre>
            <h2>Submitted Data</h2>
            <pre>
                {JSON.stringify(data.value)}
            </pre>

        </SignalForm>
    </>
}