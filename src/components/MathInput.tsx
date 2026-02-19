import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface MathInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon?: LucideIcon;
    error?: string;
}

const MathInput: React.FC<MathInputProps> = ({ label, icon: Icon, error, className, ...props }) => {
    return (
        <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-medium text-slate-300">{label}</label>
            <div className="relative group">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-400 transition-colors">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    className={twMerge(
                        "w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all font-mono",
                        Icon && "pl-10",
                        error && "border-red-500 focus:ring-red-500/50 focus:border-red-500",
                        className
                    )}
                    {...props}
                />
            </div>
            {error && <span className="text-xs text-red-400">{error}</span>}
        </div>
    );
};

export default MathInput;
