import { RenderableProps } from "preact";
import { useSignalFormInput } from "./hooks";
import { InputProps, LabeledInputProps } from "./types";


export const Input = (p: InputProps<string>) => {
    const { ctx, value, onChange } = useSignalFormInput(p)
    // should i just {...p} the props?
    return <input type={p.type} class={p.class} value={value} onChange={onChange} id={p.id || p.name} placeholder={p.placeholder} />
}
export const LabeledInput = (p: LabeledInputProps<string>) => {
    return <>
        <div>
            <label for={p.id || p.name}>{p.label}</label>
            <Input {...p} />
        </div>
    </>
}

export const TextInput = (p: InputProps<string>) => {
    p.type = 'text';
    return Input(p);
}
export const LabeledTextInput = (p: LabeledInputProps<string>) => {
    p.type = 'text';
    return LabeledInput(p);
}