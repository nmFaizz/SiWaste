"use client"

import { useRef, useState } from "react"
import { get, RegisterOptions, useFormContext } from "react-hook-form"
import { UploadCloud } from "lucide-react"
import { cn } from "@/lib/utils"

type InputSize = "sm" | "md"

export type InputFileProps = {
	id: string
	label?: string
	labelClassName?: string
	helperText?: React.ReactNode
	helperTextClassName?: string
	inputSize?: InputSize
	hideError?: boolean
	requireSquare?: boolean
validation?: RegisterOptions
} & React.ComponentPropsWithoutRef<"input">

export default function InputFile({
	id,
	label,
	helperText,
	hideError = false,
	validation,
	className,
	requireSquare = false,
	readOnly = false,
	labelClassName,
	helperTextClassName,
	...rest
}: InputFileProps) {
	const {
		register,
		setValue,
		setError,
		clearErrors,
		formState: { errors },
	} = useFormContext()

	const fileInputRef = useRef<HTMLInputElement>(null)
	const [preview, setPreview] = useState<string | null>(null)
	const [isDragging, setIsDragging] = useState(false)

	const error = get(errors, id)

	const handleFile = (file: File) => {
		if (file && file.type.startsWith("image/")) {
			const img = new Image()
			const objectUrl = URL.createObjectURL(file)

			img.onload = () => {
				const isSquare = img.width === img.height

				// if (!requireSquare || isSquare) {
				// 	const reader = new FileReader()
				// 	reader.onloadend = () => {
				// 		setPreview(reader.result as string)
				// 	}
				// 	reader.readAsDataURL(file)
				// 	setValue(id, file)
				// 	clearErrors(id)
				// } else {
				// 	setError(id, {
				// 		type: "manual",
				// 		message: "Gambar harus memiliki rasio 1:1 (persegi).",
				// 	})
				// 	setPreview(null)
				// 	setValue(id, null)
				// 	if (fileInputRef.current) {
				// 		fileInputRef.current.value = ""
				// 	}
				// }

				const reader = new FileReader()
					reader.onloadend = () => {
						setPreview(reader.result as string)
					}
					reader.readAsDataURL(file)
					setValue(id, file)
					clearErrors(id)

				URL.revokeObjectURL(objectUrl)
			}

			img.src = objectUrl
		}
	}


	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) handleFile(file)
	}

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		setIsDragging(false)
		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			handleFile(e.dataTransfer.files[0])
			e.dataTransfer.clearData()
		}
	}

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		setIsDragging(true)
	}

	const handleDragLeave = () => {
		setIsDragging(false)
	}

	return (
		<div className="w-full space-y-2">
			{label && <p className={labelClassName}>{label}</p>}

			<div
				className={cn(
					"flex flex-col items-center justify-center rounded-[4px] border border-dashed border-white-tertiary p-6 text-center transition-colors cursor-pointer",
					isDragging && "bg-gray-100 border-blue-400",
					className
				)}
				onClick={() => fileInputRef.current?.click()}
				onDrop={handleDrop}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
			>
				<UploadCloud size={32} className="mb-2 text-blue-500" />
				<p className="text-sm text-black">Klik atau drag & drop file ke sini</p>

				{preview && (
					<img
						src={preview}
						alt="Preview"
						className="mt-4 max-h-48 rounded border object-contain"
					/>
				)}
			</div>

			<input
				type="file"
				accept="image/*"
				ref={(e) => {
					fileInputRef.current = e
					register(id, validation).ref(e)
				}}
				id={id}
				name={id}
				onChange={handleChange}
				readOnly={readOnly}
				style={{ display: "none" }}
				{...rest}
			/>

			{!hideError && error && (
				<p className="text-error-main text-sm">{error.message}</p>
			)}

			{helperText && (
				<p className={cn("text-white-tertiary text-sm", helperTextClassName)}>
					{helperText}
				</p>
			)}
		</div>
	)
}
