import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    helperText?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, helperText, ...props }, ref) => {
        return (
            <div className="space-y-2">
                {label && (
                    <label className="block text-sm font-medium text-text-100">
                        {label}
                    </label>
                )}
                <input
                    type={type}
                    className={cn(
                        "flex h-12 w-full rounded-lg border border-[rgba(212,175,55,0.1)] bg-matte-700 px-4 py-3 text-base text-text-100 transition-all placeholder:text-text-500 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-[rgba(212,175,55,0.15)] disabled:cursor-not-allowed disabled:opacity-50",
                        error && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error && (
                    <p className="text-sm text-red-400">{error}</p>
                )}
                {helperText && !error && (
                    <p className="text-xs text-text-400">{helperText}</p>
                )}
            </div>
        )
    }
)
Input.displayName = "Input"

export { Input }