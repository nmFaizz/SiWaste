"use client"
import { RegisterOptions, get, useFormContext } from "react-hook-form"

import { cn } from "@/lib/utils"

type InputSize = "sm" | "md"

export type TextareaProps = {
    id: string
    label?: string
    labelClassName?: string
    helperText?: React.ReactNode
    helperTextClassName?: string
    inputSize?: InputSize
    hideError?: boolean
    validation?: RegisterOptions
    rows?: number
} & React.ComponentPropsWithoutRef<"textarea">

export default function Textarea({
    id,
    label,
    helperText,
    hideError = false,
    validation,
    className,
    inputSize = "md",
    readOnly = false,
    labelClassName,
    helperTextClassName,
    rows = 4,
    ...rest
}: TextareaProps) {
    const {
        register,
        formState: { errors },
    } = useFormContext()

    const error = get(errors, id)

    return (
        <div className="w-full space-y-2">
            {label && (
                <p className={labelClassName}>{label}</p>
            )}

            <div className="relative flex w-full gap-0">
                <div className={cn("relative w-full")}>
                    <textarea
                        {...register(id, validation)}
                        id={id}
                        name={id}
                        readOnly={readOnly}
                        disabled={readOnly}
                        rows={rows}
                        className={cn(
                            "h-full w-full caret-black rounded-[4px]",
                            "ring-1 ring-white-tertiary",
                            "placeholder:white-tertiary",
                            "focus:outline-none focus:ring-white-tertiary",
                            "bg-white text-black resize-none",
                            inputSize === "sm" && "px-3 py-2.5 text-sm placeholder:text-sm",
                            inputSize === "md" && "px-4 py-3 text-base placeholder:text-base",
                            readOnly && "cursor-not-allowed",
                            className,
                        )}
                        aria-describedby={id}
                        {...rest}
                    />
                </div>
            </div>

            {!hideError && error && <p className="text-error-main">{error.message}</p>}
            {helperText && (
                <p className={cn(
                    "text-white-tertiary",
                    helperTextClassName
                )}>
                    {helperText}
                </p>
            )}
        </div>
    )
}
