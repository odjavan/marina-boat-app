import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Card ---
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const Card = ({ children, className, ...props }: CardProps) => (
  <div className={cn("bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-xl border border-cyan-100 dark:border-slate-800 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl", className)} {...props}>
    {children}
  </div>
);

// --- Button ---
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}

export const Button = ({ children, className, variant = 'primary', size = 'md', ...props }: ButtonProps) => {
  const variants = {
    primary: "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 shadow-md hover:shadow-lg hover:scale-[1.02]",
    secondary: "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700",
    outline: "bg-transparent border-2 border-cyan-500 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/30",
    ghost: "bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-md"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3.5 text-lg"
  };

  return (
    <button
      className={cn("font-medium rounded-lg transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none", variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};

// --- Badge ---
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'slate';
}

export const Badge = ({ children, color = 'blue', className, ...props }: BadgeProps) => {
  const colors = {
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    green: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    yellow: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    red: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-800",
    purple: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    slate: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700"
  };

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold border", colors[color], className)} {...props}>
      {children}
    </span>
  );
};

// --- Inputs ---
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

export const Input = ({ className, ...props }: InputProps) => (
  <input
    className={cn("w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500", className)}
    {...props}
  />
);

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children?: React.ReactNode;
}

export const Select = ({ className, children, ...props }: SelectProps) => (
  <select
    className={cn("w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer", className)}
    {...props}
  >
    {children}
  </select>
);

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children?: React.ReactNode;
}

export const Label = ({ children, className, ...props }: LabelProps) => (
  <label className={cn("block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5", className)} {...props}>
    {children}
  </label>
);

// --- Modal/Dialog Skeleton (Simplified) ---
export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children?: React.ReactNode;
}

export const Dialog = ({ isOpen, onClose, title, children }: DialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-in fade-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 18 18" /></svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
