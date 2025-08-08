// first attempt with basic rich text area deal
import RichTextArea from 'preact-richtextarea';
import { useRef } from 'preact/hooks';
import { useSignalFormInput } from '../hooks';
import { InputProps } from '../types';
import type { JSX } from 'preact/jsx-runtime';
export function RichTextAreaInput<ContainingType>(p: InputProps<string, ContainingType> & { toolbarAdditions?: JSX.Element[] }) {
    const { ctx, value, onChange, onKeyUp, inputState } = useSignalFormInput(p)
    const editorRef = useRef<RichTextArea>(null);
    function exec(c: string, v?: any) {
        editorRef.current.execCommand(c, false, v);
        editorRef.current.doFocus();
    }
    function qcs(c: string) {
        return editorRef.current && editorRef.current.queryCommandState(c);
    }
    function clear() {
        // this.setState({ value: '' });
        editorRef.current.getDocument().body.innerHTML = '';
    }
    const actions: { [key: string]: any; } = {
        bold: { exec: () => exec('bold'), on: () => qcs('bold'), button: <b>B</b> },
        italic: { exec: () => exec('italic'), on: () => qcs('italic'), button: <i>I</i> },
        underline: { exec: () => exec('underline'), on: () => qcs('underline'), button: <u>U</u> },
        strikethrough: { exec: () => exec('strikethrough'), on: () => qcs('strikethrough'), button: <s>S</s> },
        heading1: { exec: () => exec("formatBlock", '<h1>'), button: <b>H<sub>1</sub></b> },
        heading2: { exec: () => exec("formatBlock", '<h2>'), button: <b>H<sub>2</sub></b> },
        paragraph: { exec: () => exec("formatBlock", '<p>'), button: <span>&#182;</span> },
        quote: { exec: () => exec("formatBlock", '<blockquote>'), button: <span>&#8220; &#8221;</span> },
        olist: { exec: () => exec('insertOrderedList'), on: () => qcs('insertOrderedList'), button: <span>&#35;</span> },
        ulist: { exec: () => exec('insertUnorderedList'), on: () => qcs('insertUnorderedList'), button: <span>&#8226;</span> },
        code: { exec: () => exec("formatBlock", '<pre>'), button: <span>&lt;/&gt;</span> },
        hr: { exec: () => exec('insertHorizontalRule'), button: <span>&#8213;</span> },
    }


    function onInput(e: any) {
        onChange({ currentTarget: { value: e.value } });
    }
    return <><div class="form-group orte">
        {p.label && <label for={p.id} class={p.class}>{p.label}</label>}
        <div class="input-group">
            <div class="rte-toolbar">
                {Object.keys(actions).map(k => <button type="button"
                    class={actions[k].on && actions[k].on() ? 'on' : ''}
                    onClick={actions[k].exec}>{actions[k].button}</button>)}
                {p.toolbarAdditions && <div class="rte-toolbar-additions">{p.toolbarAdditions}</div>}
            </div>
            <RichTextArea ref={editorRef}
                onInput={onInput}
                value={value.value}
                id={p.id} />
            <input type="hidden" name={p.name} value={value.value} />
        </div>
    </div>
    </>;


}
export const WYSIWYGInput = RichTextAreaInput;