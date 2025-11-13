import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "preact/jsx-runtime";
// first attempt with basic rich text area deal
import RichTextArea from 'preact-richtextarea';
import { useEffect, useRef } from 'preact/hooks';
import { useSignalFormInput } from '../hooks';
export function RichTextAreaInput(p) {
    const { ctx, value, onChange, onKeyUp, inputState } = useSignalFormInput(p);
    const editorRef = useRef(null);
    useEffect(() => {
        editorRef.current.componentDidUpdate();
    }, [p]);
    function exec(c, v) {
        editorRef.current.execCommand(c, false, v);
        editorRef.current.doFocus();
    }
    function qcs(c) {
        return editorRef.current && editorRef.current.queryCommandState(c);
    }
    function clear() {
        // this.setState({ value: '' });
        editorRef.current.getDocument().body.innerHTML = '';
    }
    const actions = {
        bold: { exec: () => exec('bold'), on: () => qcs('bold'), button: _jsx("b", { children: "B" }) },
        italic: { exec: () => exec('italic'), on: () => qcs('italic'), button: _jsx("i", { children: "I" }) },
        underline: { exec: () => exec('underline'), on: () => qcs('underline'), button: _jsx("u", { children: "U" }) },
        strikethrough: { exec: () => exec('strikethrough'), on: () => qcs('strikethrough'), button: _jsx("s", { children: "S" }) },
        heading1: { exec: () => exec("formatBlock", '<h1>'), button: _jsxs("b", { children: ["H", _jsx("sub", { children: "1" })] }) },
        heading2: { exec: () => exec("formatBlock", '<h2>'), button: _jsxs("b", { children: ["H", _jsx("sub", { children: "2" })] }) },
        paragraph: { exec: () => exec("formatBlock", '<p>'), button: _jsx("span", { children: "\u00B6" }) },
        quote: { exec: () => exec("formatBlock", '<blockquote>'), button: _jsx("span", { children: "\u201C \u201D" }) },
        olist: { exec: () => exec('insertOrderedList'), on: () => qcs('insertOrderedList'), button: _jsx("span", { children: "#" }) },
        ulist: { exec: () => exec('insertUnorderedList'), on: () => qcs('insertUnorderedList'), button: _jsx("span", { children: "\u2022" }) },
        code: { exec: () => exec("formatBlock", '<pre>'), button: _jsx("span", { children: "</>" }) },
        hr: { exec: () => exec('insertHorizontalRule'), button: _jsx("span", { children: "\u2015" }) },
    };
    function onInput(e) {
        onChange({ currentTarget: { value: e.value } });
    }
    return _jsx(_Fragment, { children: _jsxs("div", { class: "form-group orte", children: [p.label && _jsx("label", { for: p.id, class: p.class, children: p.label }), _jsxs("div", { class: "input-group", children: [_jsxs("div", { class: "rte-toolbar", children: [Object.keys(actions).map(k => _jsx("button", { type: "button", class: actions[k].on && actions[k].on() ? 'on' : '', onClick: actions[k].exec, children: actions[k].button })), p.toolbarAdditions && _jsx("div", { class: "rte-toolbar-additions", children: p.toolbarAdditions })] }), _jsx(RichTextArea, { ref: editorRef, onInput: onInput, value: value.value, id: p.id }), _jsx("input", { type: "hidden", name: p.name, value: value.value })] })] }) });
}
export const WYSIWYGInput = RichTextAreaInput;
