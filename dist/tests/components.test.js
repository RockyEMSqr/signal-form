import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { signal } from "@preact/signals";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/preact";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { SignalForm } from "../src/form";
import { CheckboxGroupInput } from "../src/inputs/checkbox-group";
import { DateInput, DateTimeInput } from "../src/inputs/datetime";
import { Input, TextInput } from "../src/inputs/input";
import { NumberInput } from "../src/inputs/number";
import { SelectInput } from "../src/inputs/select";
import { TextareaInput } from "../src/inputs/textarea";
import { RichTextAreaInput, WYSIWYGInput } from "../src/inputs/WYSIWYG";
afterEach(() => {
    cleanup();
});
describe("Preact components", () => {
    it("SignalForm renders a form and submits its data", async () => {
        let submitted;
        render(_jsxs(SignalForm, { id: "profile-form", class: "profile", initData: { name: "Jane" }, onSubmit: (_event, data) => {
                submitted = data;
            }, children: [_jsx(TextInput, { name: "name", label: "Name" }), _jsx("button", { type: "submit", children: "Save" })] }));
        const form = document.getElementById("profile-form");
        expect(form).not.toBeNull();
        expect(form.className).toBe("profile");
        fireEvent.submit(form);
        await waitFor(() => expect(submitted).toEqual({ name: "Jane" }));
    });
    it("Input renders and updates a signal", async () => {
        const user = userEvent.setup();
        const value = signal("Alpha");
        render(_jsx(Input, { id: "plain-input", label: "Plain", signal: value }));
        const input = screen.getByLabelText("Plain");
        expect(input.value).toBe("Alpha");
        await user.clear(input);
        await user.type(input, "Beta");
        expect(value.value).toBe("Beta");
    });
    it("TextInput renders a text input and updates a signal", async () => {
        const user = userEvent.setup();
        const value = signal("Jane");
        render(_jsx(TextInput, { id: "text-input", label: "Name", signal: value }));
        const input = screen.getByLabelText("Name");
        expect(input.type).toBe("text");
        await user.clear(input);
        await user.type(input, "June");
        expect(value.value).toBe("June");
    });
    it("NumberInput renders a number input and updates a signal", async () => {
        const user = userEvent.setup();
        const value = signal(2);
        render(_jsx(NumberInput, { id: "number-input", label: "Count", signal: value }));
        const input = screen.getByLabelText("Count");
        expect(input.type).toBe("number");
        await user.clear(input);
        await user.type(input, "7");
        expect(String(value.value)).toBe("7");
    });
    it("SelectInput renders options and updates a single-value signal", async () => {
        const user = userEvent.setup();
        const value = signal("viewer");
        render(_jsx(SelectInput, { id: "role-input", label: "Role", signal: value, items: [
                { label: "Viewer", value: "viewer" },
                { label: "Editor", value: "editor" }
            ] }));
        const select = screen.getByLabelText("Role");
        expect(select.value).toBe("viewer");
        await user.selectOptions(select, "editor");
        expect(value.value).toBe("editor");
    });
    it("DateTimeInput renders date/time controls and writes a zoned value", async () => {
        const user = userEvent.setup();
        const value = signal("2024-01-01T12:00:00.000Z");
        render(_jsx(DateTimeInput, { id: "meeting", label: "Meeting", dateLabel: "Meeting date", timeLabel: "Meeting time", timezone: "US/Eastern", signal: value }));
        const dateInput = screen.getByLabelText("Meeting date");
        const timeInput = screen.getByLabelText("Meeting time");
        expect(dateInput.value).toBe("2024-01-01");
        expect(timeInput.value).toBe("07:00");
        await user.clear(timeInput);
        await user.type(timeInput, "08:15");
        expect(String(value.value)).toContain("2024-01-01T08:15:00");
        expect(String(value.value)).toMatch(/-05:00$/);
    });
    it("DateInput renders a date control and updates a signal", async () => {
        const user = userEvent.setup();
        const value = signal("2024-01-15");
        render(_jsx(DateInput, { id: "day-input", label: "Day", timezone: "UTC", signal: value }));
        const input = screen.getByLabelText("Day");
        expect(input.value).toBe("2024-01-15");
        await user.clear(input);
        await user.type(input, "2024-01-20");
        expect(String(value.value)).toContain("2024-01-20");
    });
    it("TextareaInput renders a textarea and updates a signal", async () => {
        const user = userEvent.setup();
        const value = signal("Original");
        render(_jsx(TextareaInput, { id: "notes-input", label: "Notes", signal: value }));
        const textarea = screen.getByLabelText("Notes");
        expect(textarea.value).toBe("Original");
        await user.clear(textarea);
        await user.type(textarea, "Updated notes");
        expect(value.value).toBe("Updated notes");
    });
    it("CheckboxGroupInput renders options and updates an array signal", async () => {
        const user = userEvent.setup();
        const value = signal(["alpha"]);
        render(_jsx(CheckboxGroupInput, { id: "tags", label: "Tags", signal: value, items: [
                { label: "Alpha", value: "alpha" },
                { label: "Beta", value: "beta" }
            ] }));
        const alpha = screen.getByLabelText("Alpha");
        const beta = screen.getByLabelText("Beta");
        expect(alpha.checked).toBe(true);
        expect(beta.checked).toBe(false);
        await user.click(beta);
        expect(value.value).toEqual(["alpha", "beta"]);
    });
    it("RichTextAreaInput renders the rich text editor from its signal", () => {
        const value = signal("<p>Hello</p>");
        const { container } = render(_jsx(RichTextAreaInput, { id: "editor", label: "Body", signal: value, silent: true }));
        expect(screen.getByText("Body")).not.toBeNull();
        expect(container.querySelector("#editor")).not.toBeNull();
    });
    it("WYSIWYGInput renders the RichTextAreaInput alias", () => {
        const value = signal("<strong>Alias</strong>");
        const { container } = render(_jsx(WYSIWYGInput, { id: "wysiwyg", signal: value, silent: true }));
        expect(container.querySelector("#wysiwyg")).not.toBeNull();
    });
});
