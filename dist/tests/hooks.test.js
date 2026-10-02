import { jsx as _jsx } from "preact/jsx-runtime";
import { signal } from "@preact/signals";
import { act, renderHook } from "@testing-library/preact";
import { describe, expect, it, vi } from "vitest";
import { SignalFormCtx } from "../src/context";
import { useGetInputSignal, useSignalForm, useSignalFormInput } from "../src/hooks";
import { deepSignal, useDeepSignal } from "deepsignal";
describe("form hooks", () => {
    it("useSignalForm creates the initial form state", () => {
        const { result } = renderHook(() => useSignalForm());
        expect(result.current.formState.submittedCount).toBe(0);
        expect(result.current.formState.submitted).toBe(false);
        expect(result.current.formState.submitting).toBe(false);
        expect(result.current.formState.formDataSignal).toBeUndefined();
    });
    it("useGetInputSignal uses a supplied signal when there is no field name", () => {
        const supplied = signal("initial");
        const { result } = renderHook(() => useGetInputSignal({ signal: supplied }));
        expect(result.current).toBe(supplied);
        act(() => {
            result.current.value = "changed";
        });
        expect(supplied.value).toBe("changed");
    });
    it("useGetInputSignal uses a Signal passed as value", () => {
        const supplied = signal("from-value");
        const { result } = renderHook(() => useGetInputSignal({ value: supplied }));
        expect(result.current).toBe(supplied);
    });
    it("useGetInputSignal creates a local signal for a plain value", () => {
        var _a, _b;
        const { result } = renderHook(() => useGetInputSignal({ value: "plain" }));
        expect((_a = result.current) === null || _a === void 0 ? void 0 : _a.value).toBe("plain");
        act(() => {
            result.current.value = "updated";
        });
        expect((_b = result.current) === null || _b === void 0 ? void 0 : _b.value).toBe("updated");
    });
    it("useGetInputSignal resolves a named field from form context", () => {
        var _a;
        const data = deepSignal({ profile: { name: "Rocky" } });
        const wrapper = ({ children }) => (_jsx(SignalFormCtx.Provider, { value: {
                data,
                fieldMap: {},
                ctxState: useDeepSignal({ count: 0 }),
                formState: useDeepSignal({ submittedCount: 0 })
            }, children: children }));
        const { result } = renderHook(() => useGetInputSignal({ name: "profile.name" }), { wrapper });
        expect((_a = result.current) === null || _a === void 0 ? void 0 : _a.value).toBe("Rocky");
        act(() => {
            result.current.value = "Jane";
        });
        expect(data.profile.name).toBe("Jane");
    });
    it("useSignalFormInput creates field state and an automatic id", () => {
        var _a;
        const data = deepSignal({ name: "Rocky" });
        const fieldMap = {};
        const wrapper = ({ children }) => (_jsx(SignalFormCtx.Provider, { value: {
                data,
                fieldMap,
                ctxState: useDeepSignal({ count: 0 }),
                formState: useDeepSignal({ submittedCount: 0 })
            }, children: children }));
        const props = { name: "name" };
        const { result } = renderHook(() => useSignalFormInput(props), { wrapper });
        expect(props.id).toBe("name-0");
        expect((_a = result.current.value) === null || _a === void 0 ? void 0 : _a.value).toBe("Rocky");
        expect(fieldMap.name).toBeDefined();
        expect(fieldMap.name.inputSignal).toBe(result.current.value);
        expect(fieldMap.name.validate()).toBe(true);
    });
    it("useSignalFormInput onChange updates the signal, validates, and calls the consumer", () => {
        const data = deepSignal({ name: "ok" });
        const onChange = vi.fn();
        const validate = vi.fn((value) => value.length >= 3);
        const wrapper = ({ children }) => (_jsx(SignalFormCtx.Provider, { value: {
                data,
                fieldMap: {},
                ctxState: useDeepSignal({ count: 0 }),
                formState: useDeepSignal({ submittedCount: 0 })
            }, children: children }));
        const { result } = renderHook(() => useSignalFormInput({
            name: "name",
            validate,
            onChange
        }), { wrapper });
        const event = { currentTarget: { value: "valid" } };
        act(() => result.current.onChange(event));
        expect(data.name).toBe("valid");
        expect(validate).toHaveBeenCalled();
        expect(result.current.inputState.valid).toBe(false);
        expect(onChange).toHaveBeenCalledWith(event);
        expect(result.current.inputState.validate()).toBe(true);
    });
    it("useSignalFormInput onKeyUp updates the signal and calls the consumer", () => {
        const data = deepSignal({ name: "before" });
        const onKeyUp = vi.fn();
        const wrapper = ({ children }) => (_jsx(SignalFormCtx.Provider, { value: {
                data,
                fieldMap: {},
                ctxState: useDeepSignal({ count: 0 }),
                formState: useDeepSignal({ submittedCount: 0 })
            }, children: children }));
        const { result } = renderHook(() => useSignalFormInput({
            name: "name",
            onKeyUp
        }), { wrapper });
        const event = { currentTarget: { value: "after" } };
        act(() => result.current.onKeyUp(event));
        expect(data.name).toBe("after");
        expect(onKeyUp).toHaveBeenCalledWith(event);
    });
});
