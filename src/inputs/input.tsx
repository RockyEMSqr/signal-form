import { useSignalFormInput } from "../hooks";
import { InputProps } from "../types";


export const Input = <ContainingType = never, InputType = string>(p: InputProps<InputType, ContainingType>) => {
    const { ctx, value, onChange, onKeyUp, inputState } = useSignalFormInput(p)
    // should i just {...p} the props?
    // console.log('Input render', p.name, value);
    let classes: string[] = [];
    p.class && classes.push(p.class);
    inputState?.class && classes.push(inputState.class);
    return <>
        {p.label && <label for={p.id}>{p.label}</label>}
        <input
            name={p.name}
            type={p.type}
            class={classes.join(' ')}
            value={value}
            onChange={onChange}
            id={p.id}
            placeholder={p.placeholder}
            onKeyUp={onKeyUp}
        /></>
}

export const TextInput = (p: InputProps<string>) => {
    p.type = 'text';
    return Input(p);
}