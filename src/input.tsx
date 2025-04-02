import { RenderableProps } from "preact";
import { useGetInputId, useSignalFormInput } from "./hooks";
import { InputProps, LabeledInputProps } from "./types";
import { useDeepSignal } from "./deepSignal";
import { LabelChildren } from "./label";


export const Input = (p: InputProps<string>) => {
    const { ctx, value, onChange, onKeyUp } = useSignalFormInput(p)
    // should i just {...p} the props?
    // console.log('Input render', p.name, value);
    let classes: string[] = [];
    p.class && classes.push(p.class);
    const inputState = ctx.fieldMap[p.name];
    inputState?.class && classes.push(inputState.class);
    return <input
        type={p.type}
        class={classes.join(' ')}
        value={value}
        onChange={onChange}
        id={p.id}
        placeholder={p.placeholder}
        onKeyUp={onKeyUp}
    />
}
export const LabeledInput = (p: LabeledInputProps<string>) => {
    // todo: Type 'Element' is not assignable to type 'Element | (Element & ComponentChild)'. why?
    // let id = useGetInputId(p)
    return <>
        <div>
            <LabelChildren {...p}>
                <Input {...p} />
            </LabelChildren>
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