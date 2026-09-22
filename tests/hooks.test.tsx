import { signal } from "@preact/signals";
import { act, renderHook } from "@testing-library/preact";
import { describe, expect, it, vi } from "vitest";
import { SignalFormCtx } from "../src/context";
import { useGetInputSignal, useSignalForm, useSignalFormInput } from "../src/hooks";
import { useDeepSignal } from "deepsignal";

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
        const { result } = renderHook(() =>
            useGetInputSignal<string, never>({ signal: supplied })
        );

        expect(result.current).toBe(supplied);

        act(() => {
            result.current!.value = "changed";
        });

        expect(supplied.value).toBe("changed");
    });

    it("useGetInputSignal uses a Signal passed as value", () => {
        const supplied = signal("from-value");
        const { result } = renderHook(() =>
            useGetInputSignal<string, never>({ value: supplied as any })
        );

        expect(result.current).toBe(supplied);
    });

    it("useGetInputSignal creates a local signal for a plain value", () => {
        const { result } = renderHook(() =>
            useGetInputSignal<string, never>({ value: "plain" })
        );

        expect(result.current?.value).toBe("plain");

        act(() => {
            result.current!.value = "updated";
        });

        expect(result.current?.value).toBe("updated");
    });

    it("useGetInputSignal resolves a named field from form context", () => {
        const data = useDeepSignal({ profile: { name: "Rocky" } });
        const wrapper = ({ children }: { children: any }) => (
            <SignalFormCtx.Provider
                value={{
                    data,
                    fieldMap: {},
                    ctxState: useDeepSignal({ count: 0 }),
                    formState: useDeepSignal({ submittedCount: 0 } as any)
                }}
            >
                {children}
            </SignalFormCtx.Provider>
        );

        const { result } = renderHook(
            () => useGetInputSignal<string, { profile: { name: string } }>({ name: "profile.name" }),
            { wrapper }
        );

        expect(result.current?.value).toBe("Rocky");

        act(() => {
            result.current!.value = "Jane";
        });

        expect(data.profile.name).toBe("Jane");
    });

    it("useSignalFormInput creates field state and an automatic id", () => {
        const data = useDeepSignal({ name: "Rocky" });
        const fieldMap: Record<string, any> = {};
        const wrapper = ({ children }: { children: any }) => (
            <SignalFormCtx.Provider
                value={{
                    data,
                    fieldMap,
                    ctxState: useDeepSignal({ count: 0 }),
                    formState: useDeepSignal({ submittedCount: 0 } as any)
                }}
            >
                {children}
            </SignalFormCtx.Provider>
        );
        const props: any = { name: "name" };

        const { result } = renderHook(
            () => useSignalFormInput<string, { name: string }>(props),
            { wrapper }
        );

        expect(props.id).toBe("name-0");
        expect(result.current.value?.value).toBe("Rocky");
        expect(fieldMap.name).toBeDefined();
        expect(fieldMap.name.inputSignal).toBe(result.current.value);
        expect(fieldMap.name.validate()).toBe(true);
    });

    it("useSignalFormInput onChange updates the signal, validates, and calls the consumer", () => {
        const data = useDeepSignal({ name: "ok" });
        const onChange = vi.fn();
        const validate = vi.fn((value: string) => value.length >= 3);
        const wrapper = ({ children }: { children: any }) => (
            <SignalFormCtx.Provider
                value={{
                    data,
                    fieldMap: {},
                    ctxState: useDeepSignal({ count: 0 }),
                    formState: useDeepSignal({ submittedCount: 0 } as any)
                }}
            >
                {children}
            </SignalFormCtx.Provider>
        );

        const { result } = renderHook(
            () =>
                useSignalFormInput<string, { name: string }>({
                    name: "name",
                    validate,
                    onChange
                }),
            { wrapper }
        );

        const event = { currentTarget: { value: "valid" } } as any;
        act(() => result.current.onChange(event));

        expect(data.name).toBe("valid");
        expect(validate).toHaveBeenCalled();
        expect(result.current.inputState.valid).toBe(false);
        expect(onChange).toHaveBeenCalledWith(event);

        expect(result.current.inputState.validate()).toBe(true);
    });

    it("useSignalFormInput onKeyUp updates the signal and calls the consumer", () => {
        const data = useDeepSignal({ name: "before" });
        const onKeyUp = vi.fn();
        const wrapper = ({ children }: { children: any }) => (
            <SignalFormCtx.Provider
                value={{
                    data,
                    fieldMap: {},
                    ctxState: useDeepSignal({ count: 0 }),
                    formState: useDeepSignal({ submittedCount: 0 } as any)
                }}
            >
                {children}
            </SignalFormCtx.Provider>
        );

        const { result } = renderHook(
            () =>
                useSignalFormInput<string, { name: string }>({
                    name: "name",
                    onKeyUp
                }),
            { wrapper }
        );

        const event = { currentTarget: { value: "after" } } as any;
        act(() => result.current.onKeyUp(event));

        expect(data.name).toBe("after");
        expect(onKeyUp).toHaveBeenCalledWith(event);
    });
});
