import { JSX } from "preact";
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

const StateProbe = ({ path }: { path: string }) => {
    const ctx = useContext(SignalFormCtx);
    const [value, setValue] = useState<any>(() => dlv(ctx.data, path));

    useEffect(() => {
        if (!ctx?.data) {
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

    return <output data-testid={`state-${path}`}>{JSON.stringify(value)}</output>;
};

const renderForm = (children: JSX.Element) =>
    render(
        <SignalForm initData={{
            name: "Jane",
            count: 2,
            role: "viewer",
            meeting: "2024-01-01T12:00:00.000Z",
            tags: ["alpha"],
            day: "2024-01-15"
        }}>
            {children}
        </SignalForm>
    );

describe("SignalForm inputs", () => {
    it("keeps text inputs in sync with the form signal", async () => {
        const user = userEvent.setup();
        renderForm(
            <>
                <TextInput label="Name" name="name" />
                <StateProbe path="name" />
            </>
        );
        const input = screen.getByLabelText("Name") as HTMLInputElement;
        expect(input.value).toBe("Jane");

        await user.clear(input);
        await user.type(input, "June");

        expect(screen.getByTestId("state-name").textContent).toBe("\"June\"");
    });

    it("applies aria-invalid when validation fails on number inputs", async () => {
        const user = userEvent.setup();
        renderForm(
            <>
                <NumberInput label="Count" name="count" validate={(v) => Number(v) > 0} />
                <StateProbe path="count" />
            </>
        );
        const input = screen.getByLabelText("Count") as HTMLInputElement;
        expect(input.getAttribute("aria-invalid")).toBeNull();

        await user.clear(input);
        await user.type(input, "0");

        const storedCount = screen.getByTestId("state-count").textContent || "\"0\"";
        expect(JSON.parse(storedCount)).toBe("0");
        expect(input.getAttribute("aria-invalid")).toBe("true");
    });

    it("keeps select values synced with signal data", async () => {
        const user = userEvent.setup();
        renderForm(
            <>
                <SelectInput
                    label="Role"
                    name="role"
                    placeholder="Choose role"
                    items={[
                        { label: "Viewer", value: "viewer" },
                        { label: "Editor", value: "editor" }
                    ]}
                />
                <StateProbe path="role" />
            </>
        );
        const select = screen.getByLabelText("Role") as HTMLSelectElement;
        expect(select.value).toBe("viewer");

        await user.selectOptions(select, "editor");

        expect(screen.getByTestId("state-role").textContent).toBe("\"editor\"");
    });

    it("normalizes timezone aware date and time inputs", async () => {
        const user = userEvent.setup();
        renderForm(
            <>
                <DateTimeInput
                    name="meeting"
                    label="Meeting"
                    dateLabel="Meeting date"
                    timeLabel="Meeting time"
                    timezone="US/Eastern"
                    required
                />
                <StateProbe path="meeting" />
            </>
        );

        const dateInput = screen.getByLabelText("Meeting date") as HTMLInputElement;
        const timeInput = screen.getByLabelText("Meeting time") as HTMLInputElement;

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
        renderForm(
            <>
                <CheckboxGroupInput
                    label="Tags"
                    name="tags"
                    items={[
                        { label: "Alpha", value: "alpha" },
                        { label: "Beta", value: "beta" }
                    ]}
                />
                <StateProbe path="tags" />
            </>
        );

        const beta = screen.getByLabelText("Beta") as HTMLInputElement;
        expect(beta.checked).toBe(false);

        await user.click(beta);
        expect(screen.getByTestId("state-tags").textContent).toBe("[\"alpha\",\"beta\"]");

        await user.click(beta);
        expect(screen.getByTestId("state-tags").textContent).toBe("[\"alpha\"]");
    });

    it("keeps date inputs aligned with timezone aware values", async () => {
        const user = userEvent.setup();
        renderForm(
            <>
                <DateInput name="day" label="Day" timezone="UTC" />
                <StateProbe path="day" />
            </>
        );

        const input = screen.getByLabelText("Day") as HTMLInputElement;
        expect(input.value).toBe("2024-01-15");

        await user.clear(input);
        await user.type(input, "2024-01-20");

        const storedValue = JSON.parse(screen.getByTestId("state-day").textContent || "\"\"");
        expect(storedValue).toContain("2024-01-20");
    });
});
