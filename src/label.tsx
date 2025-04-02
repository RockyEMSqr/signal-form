import { LabeledInputProps } from "./types";

// todo: Need a better name for this
export const LabelChildren = (p: LabeledInputProps<any>) => {
    return <>
        <label for={p.id}>{p.label}</label>
        {p.children}
    </>

}