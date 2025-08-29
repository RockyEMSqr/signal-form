import { useSignal } from "@preact/signals";
import { SignalForm, TextInput, useSignalForm } from "../../../src";
import { useDeepSignal } from "deepsignal";

export function AddressEx() {
    const data = useDeepSignal({
        address: {
            street: '',
            city: '',
            state: '',
            zip: ''
        }
    })
    let formHook = useSignalForm();
    const submittedData = useSignal<any>();
    return <>
        <SignalForm {...formHook} signal={data} onSubmit={async (e, d, ds, forminfo) => {
            console.log(JSON.stringify(forminfo), forminfo == formHook.formState, e, d, ds)
            return new Promise((res, rej) => {
                setTimeout(() => {
                    submittedData.value = { ...d };
                    res();
                }, 1000)
            })
        }}>

            <div><TextInput label="Street" name="address.street" /></div>
            <div><TextInput label="City" name="address.city" /></div>
            <div><TextInput label="State" name="address.state" /></div>
            <div><TextInput label="zip" name="address.zip" /></div>

            <button type="button" onClick={() => {
                data.address.street = '1234 Street Rd';
                data.address.city = 'Cityville';
                data.address.state = 'XX';
                data.address.zip = '99999-9999'

            }}>Throw in an address</button>
            {!formHook.formState.submitting && <button>Submit</button>}
            {formHook.formState.submitting && <span>Submitting</span>}
            {/* <div>Submitted Count: {formHook.formState.$submittedCount}</div> */}
            <h2>State</h2>
            <pre>
                {JSON.stringify(formHook.formState)}
            </pre>
            <h2>Submitted Data</h2>
            <pre>
                {JSON.stringify(submittedData.value)}
            </pre>

        </SignalForm>
    </>
}