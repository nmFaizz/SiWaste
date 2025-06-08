"use client"
import { useState } from "react"
import { RegisterOptions, get, useFormContext } from "react-hook-form"
import { Eye, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"

type InputSize = "sm" | "md"

export type InputProps = {
	id: string
	label?: string
	labelClassName?: string
	helperText?: React.ReactNode
	helperTextClassName?: string
	inputSize?: InputSize
	hideError?: boolean
	validation?: RegisterOptions
} & React.ComponentPropsWithoutRef<"input">

export default function Input({
	id,
	label,
	helperText,
	hideError = false,
	validation,
	className,
	inputSize = "md",
	type = "text",
	readOnly = false,
	labelClassName,
	helperTextClassName,
	...rest
}: InputProps) {
	const {
		register,
		formState: { errors },
	} = useFormContext()

	const [showPassword, setShowPassword] = useState(false)

	const error = get(errors, id)

	return (
		<div className="w-full space-y-2">
			{label && (
				<p className={labelClassName}>{label}</p>
			)}

			<div className="relative flex w-full gap-0">
				<div className={cn("relative w-full")}>
					<input
						{...register(id, validation)}
						type={
							type === "password" ? (showPassword ? "text" : "password") : type
						}
						id={id}
						name={id}
						readOnly={readOnly}
						disabled={readOnly}
						className={cn(
							"h-full w-full caret-black rounded-[4px]",
							"ring-1 ring-white-tertiary",
							"placeholder:white-tertiary",
							"focus:outline-none focus:ring-white-tertiary",
							"bg-white text-black",
							inputSize === "sm" && "px-3 py-2.5 text-sm placeholder:text-sm",
							inputSize === "md" && "px-4 py-3 text-base placeholder:text-base",
							readOnly && "cursor-not-allowed",
							className,
						)}
						aria-describedby={id}
						{...rest}
					/>

					{type === "password" && (
						<div
							className={cn(
								"absolute bottom-0 right-0 h-full",
								"flex items-center justify-center pr-3",
								"text-lg text-gray-900 md:text-xl",
								"cursor-pointer",
							)}
							onClick={() => setShowPassword(!showPassword)}
						>
							{showPassword ? <EyeOff /> : <Eye />}
						</div>
					)}
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
