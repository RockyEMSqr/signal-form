import { Input, SignalForm, TextInput, useSignalForm } from "../../../src";
import { useDeepSignal } from "../../../src/deepSignal";
import { useEffect } from "preact/hooks";
const formData = { ty2: 'CXXXXXXXXXX' }

export function RegularInputs() {
    const fffffformData = useDeepSignal(formData);
    useEffect(() => {
        setInterval(() => {
            formData.ty2 = Date.now();
            console.log('WTF')
        }, 1000)
    }, [])
    return <>
        <h1>Regular Inputs?</h1>
        <SignalForm signal={fffffformData} onSubmit={(e, data, formSignal, formState, FieldMap, formData) => {
            console.log(data, formData)
        }}>
            <input name="test" />
            <label><input checked={true} type="checkbox" name="select" value="a" />XXXXXXXXa</label>
            <label><input type="checkbox" name="select" value="b" />XXXXXXXXb</label>
            <label><input type="checkbox" name="select" value="c" />XXXXXXXXc</label>
            <label><input type="checkbox" name="select" value="d" />XXXXXXXXd</label>
            <label><input type="checkbox" name="select" value="e" />XXXXXXXXe</label>

            <label><input name="ty" /> </label>
            <Input name="ty2" value="23" />
            <button>Submit</button>
        </SignalForm>
    </>
}