import { SignalForm, TextInput, useSignalForm } from "../../../src";

export function FormStateTinker() {
    let formHook = useSignalForm();
    return <>
        <SignalForm {...formHook} onSubmit={async (e, d, ds, forminfo) => {
            console.log(JSON.stringify(forminfo), forminfo == formHook.formState)
            return new Promise((res, rej) => {
                setTimeout(() => {
                    res();
                }, 9000)
            })
        }}>

            <TextInput />
            {!formHook.formState.submitting && <button>Submit</button>}
            {formHook.formState.submitting && <span>Submitting</span>}
            {/* <div>Submitted Count: {formHook.formState.$submittedCount}</div> */}
            <pre>
                {JSON.stringify(formHook.formState)}
            </pre>

        </SignalForm>
    </>
}