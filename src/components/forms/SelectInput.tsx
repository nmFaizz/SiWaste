import * as React from "react";
import { Controller, Control, FieldValues, Path, RegisterOptions } from "react-hook-form";
import { cn } from "@/lib/utils";

type Option = {
    label: string;
    value: string | number;
};

type SelectInputProps<T extends FieldValues> = {
    name: Path<T>;
    control: Control<T>;
    label?: string;
    options: Option[];
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    rules?: RegisterOptions<T>;
};

export default function SelectInput<T extends FieldValues>({
    name,
    control,
    label,
    options,
    rules,
    placeholder = "Select...",
    className,
    disabled = false,
}: SelectInputProps<T>) {
    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({
                field,
                fieldState: { error },
            }) => (
                <div className={cn("flex flex-col gap-1", className)}>
                    {label && (
                        <label htmlFor={name} className="font-medium text-sm">
                            {label}
                        </label>
                    )}
                    <select
                        id={name}
                        {...field}
                        disabled={disabled}
                        className={cn(
                            "border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500",
                            error && "border-red-500",
                            disabled && "bg-gray-100 cursor-not-allowed"
                        )}
                    >
                        <option value="" disabled>
                            {placeholder}
                        </option>
                        {options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    {error && (
                        <span className="text-xs text-red-500">{error.message as string}</span>
                    )}
                </div>
            )}
        />
    );
}