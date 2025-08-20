import { useSignal } from "@preact/signals";
import { SignalForm, WYSIWYGInput } from "../../../src";
import { useEffect } from "preact/hooks";
import { useDeepSignal } from "deepsignal";

export function WysiwygEx() {
    const initData = useDeepSignal({ html: '<h1>Hi</h1>', html2: '<h1>Bye</h1>' })
    useEffect(() => {
        console.log('UseEffect', initData)
    }, [initData])
    return <SignalForm signal={initData} onSubmit={(e, data) => {
        console.log(data);
    }}>

        <WYSIWYGInput name='html' />

        <WYSIWYGInput name="html2" />

        <button>Submit</button>

        <button type="button" onClick={() => {
            initData.html = initData.html + ' -------==-=-=-=-=-=-=-=-=-----------'
            // initData.value = { ...initData.value }
            // console.log(initData.value)
        }}>append</button>
    </SignalForm>
}