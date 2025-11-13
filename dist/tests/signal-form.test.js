import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "preact/jsx-runtime";
import { useContext, useEffect, useState } from "preact/hooks";
import { render, screen } from "@testing-library/preact";
import userEvent from "@testing-library/user-event";
import { effect } from "@preact/signals";
import dlv from "dlv";
import { describe, expect, it } from "vitest";
import { DateTime } from "luxon";
import { SignalForm } from "../src/form";
import { TextInput } from "../src/inputs/input";
import { NumberInput } from "../src/inputs/number";
import { SelectInput } from "../src/inputs/select";
import { DateInput, DateTimeInput } from "../src/inputs/datetime";
import { CheckboxGroupInput } from "../src/inputs/checkbox-group";
import { SignalFormCtx } from "../src/context";
const StateProbe = ({ path }) => {
    const ctx = useContext(SignalFormCtx);
    const [value, setValue] = useState(() => dlv(ctx.data, path));
    useEffect(() => {
        if (!(ctx === null || ctx === void 0 ? void 0 : ctx.data)) {
            return;
        }
        const dispose = effect(() => {
            const next = dlv(ctx.data, path);
            setValue(next);
        });
        return () => {
            dispose();
        };
    }, [ctx, path]);
    return _jsx("output", { "data-testid": `state-${path}`, children: JSON.stringify(value) });
};
const renderForm = (children) => render(_jsx(SignalForm, { initData: {
        name: "Jane",
        count: 2,
        role: "viewer",
        meeting: "2024-01-01T12:00:00.000Z",
        tags: ["alpha"],
        day: "2024-01-15"
    }, children: children }));
describe("SignalForm inputs", () => {
    it("keeps text inputs in sync with the form signal", async () => {
        const user = userEvent.setup();
        renderForm(_jsxs(_Fragment, { children: [_jsx(TextInput, { label: "Name", name: "name" }), _jsx(StateProbe, { path: "name" })] }));
        const input = screen.getByLabelText("Name");
        expect(input.value).toBe("Jane");
        await user.clear(input);
        await user.type(input, "June");
        expect(screen.getByTestId("state-name").textContent).toBe("\"June\"");
    });
    it("applies aria-invalid when validation fails on number inputs", async () => {
        const user = userEvent.setup();
        renderForm(_jsxs(_Fragment, { children: [_jsx(NumberInput, { label: "Count", name: "count", validate: (v) => Number(v) > 0 }), _jsx(StateProbe, { path: "count" })] }));
        const input = screen.getByLabelText("Count");
        expect(input.getAttribute("aria-invalid")).toBeNull();
        await user.clear(input);
        await user.type(input, "0");
        const storedCount = screen.getByTestId("state-count").textContent || "\"0\"";
        expect(JSON.parse(storedCount)).toBe("0");
        expect(input.getAttribute("aria-invalid")).toBe("true");
    });
    it("keeps select values synced with signal data", async () => {
        const user = userEvent.setup();
        renderForm(_jsxs(_Fragment, { children: [_jsx(SelectInput, { label: "Role", name: "role", placeholder: "Choose role", items: [
                        { label: "Viewer", value: "viewer" },
                        { label: "Editor", value: "editor" }
                    ] }), _jsx(StateProbe, { path: "role" })] }));
        const select = screen.getByLabelText("Role");
        expect(select.value).toBe("viewer");
        await user.selectOptions(select, "editor");
        expect(screen.getByTestId("state-role").textContent).toBe("\"editor\"");
    });
    it("normalizes timezone aware date and time inputs", async () => {
        const user = userEvent.setup();
        renderForm(_jsxs(_Fragment, { children: [_jsx(DateTimeInput, { name: "meeting", label: "Meeting", dateLabel: "Meeting date", timeLabel: "Meeting time", timezone: "US/Eastern", required: true }), _jsx(StateProbe, { path: "meeting" })] }));
        const dateInput = screen.getByLabelText("Meeting date");
        const timeInput = screen.getByLabelText("Meeting time");
        expect(dateInput.value).toBe("2024-01-01");
        expect(timeInput.value).toBe("07:00");
        await user.clear(timeInput);
        await user.type(timeInput, "08:15");
        const storedValue = JSON.parse(screen.getByTestId("state-meeting").textContent || "\"\"");
        expect(DateTime.fromISO(storedValue).toUTC().toISO()).toContain("T13:15:00.000Z");
        expect(storedValue.endsWith("-05:00")).toBe(true);
    });
    it("syncs checkbox groups with array signals", async () => {
        const user = userEvent.setup();
        renderForm(_jsxs(_Fragment, { children: [_jsx(CheckboxGroupInput, { label: "Tags", name: "tags", items: [
                        { label: "Alpha", value: "alpha" },
                        { label: "Beta", value: "beta" }
                    ] }), _jsx(StateProbe, { path: "tags" })] }));
        const beta = screen.getByLabelText("Beta");
        expect(beta.checked).toBe(false);
        await user.click(beta);
        expect(screen.getByTestId("state-tags").textContent).toBe("[\"alpha\",\"beta\"]");
        await user.click(beta);
        expect(screen.getByTestId("state-tags").textContent).toBe("[\"alpha\"]");
    });
    it("keeps date inputs aligned with timezone aware values", async () => {
        const user = userEvent.setup();
        renderForm(_jsxs(_Fragment, { children: [_jsx(DateInput, { name: "day", label: "Day", timezone: "UTC" }), _jsx(StateProbe, { path: "day" })] }));
        const input = screen.getByLabelText("Day");
        expect(input.value).toBe("2024-01-15");
        await user.clear(input);
        await user.type(input, "2024-01-20");
        const storedValue = JSON.parse(screen.getByTestId("state-day").textContent || "\"\"");
        expect(storedValue).toContain("2024-01-20");
    });
});
