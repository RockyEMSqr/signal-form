import { useSignal } from "@preact/signals";
import { SignalForm, TextInput, useSignalForm } from "../../../src";
import { useDeepSignal } from "deepsignal";
import { useEffect } from "preact/hooks";
export function LoadDataLater() {
    const { formState } = useSignalForm();
    const formData = useDeepSignal({
        a: 1,
        b: '',
        c: '',
        venue: {
            street: '',
            city: '',
            state: '',
            zip: ''
        },
        name: ''
    });
    useEffect(() => {
        setInterval(() => {
            formData.name = Date.now() + ' This came in later'
        }, 1000)
    }, [])

    return <>
        <button onClick={e => {
            formData.a++
            formData.b = 'Hello'
            formData.c = 'World'
            // formData.value = { ...formData.value }

            formData.venue.street = '54645 a street'
            formData.venue.city = 'Cityville';
            formData.venue.state = 'XX'
            formData.venue.zip = '12345'

        }}>++</button>
        <SignalForm
            signal={formData}
            formState={formState}
        >

            <TextInput name="a" label="A" />
            <TextInput name="b" label="B" />
            <TextInput name="c" label="C" />
            <div>
                <h2>Address</h2>
                <TextInput name="venue.street" label="street" />
                <TextInput name="venue.city" label="city" />
                <TextInput name="venue.state" label="state" />
                <TextInput name="venue.zip" label="zip" />
            </div>
            <h2>Name</h2>
            <TextInput name="name" label="name" />
            <h2>A bunch of inputs that follow a</h2>
            {Array.from({ length: 2000 }).map(e => <TextInput name="a" />)}
        </SignalForm>

        <pre>
            {JSON.stringify(formData)}
        </pre>
    </>
}