"use client";

import React from "react";

interface Option {
  label: string;
  value: string | number;
}

interface FormFieldProps {
  label: string;
  type?: "text" | "email" | "number" | "color" | "textarea" | "select" | "toggle";
  value: any;
  onChange: (value: any) => void;
  options?: Option[];
  placeholder?: string;
  error?: string;
  required?: boolean;
  rows?: number;
  disabled?: boolean;
  helpText?: string;
}

export default function FormField({
  label,
  type = "text",
  value,
  onChange,
  options = [],
  placeholder,
  error,
  required = false,
  rows = 3,
  disabled = false,
  helpText,
}: FormFieldProps) {
  const baseInputStyles =
    "w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs font-semibold text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 disabled:bg-gray-50 disabled:opacity-60 transition-all";

  return (
    <div className="space-y-1.5 w-full">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {helpText && <span className="text-[0.68rem] text-gray-400 font-medium">{helpText}</span>}
      </div>

      {type === "textarea" ? (
        <textarea
          rows={rows}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={baseInputStyles}
        />
      ) : type === "select" ? (
        <select
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={baseInputStyles}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === "toggle" ? (
        <button
          type="button"
          onClick={() => onChange(!value)}
          disabled={disabled}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            value ? "bg-amber-500" : "bg-gray-200"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
              value ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      ) : type === "color" ? (
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={value || "#faa926"}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="h-9 w-12 cursor-pointer rounded-lg border border-gray-200 bg-white p-1"
          />
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#faa926"
            disabled={disabled}
            className={baseInputStyles}
          />
        </div>
      ) : (
        <input
          type={type}
          value={value ?? ""}
          onChange={(e) =>
            onChange(type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value)
          }
          placeholder={placeholder}
          disabled={disabled}
          className={baseInputStyles}
        />
      )}

      {error && <p className="text-[0.7rem] font-bold text-red-500 mt-1">{error}</p>}
    </div>
  );
}
