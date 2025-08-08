import { SignalForm, WYSIWYGInput } from "../../../src";

export function WysiwygEx() {
    return <SignalForm onSubmit={(e, data) => {
        console.log(data);
    }}>

        <WYSIWYGInput name="html" />

        <button>Submit</button>
    </SignalForm>
}