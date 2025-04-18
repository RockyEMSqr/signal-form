import { useSignalFormInput } from "../hooks";
import { InputProps } from "../types";

export const NumberInput = (p: InputProps<number>) => {
    const { ctx, value, onChange } = useSignalFormInput(p);
    return <>
        <div>
            {/* <label for="todo" class="form-label">{p.label}</label> */}
            <div class='input-field'>
                <div class="icon-wrapper ">
                    <i class="fa fa-image workspace-icon"></i>
                    <p>{p.label}</p>
                </div>
                <input type="number" class="form-control recital-tool-input-button" value={value} onChange={onChange} id="todo" placeholder={p.label} />
            </div>
        </div>
    </>
}