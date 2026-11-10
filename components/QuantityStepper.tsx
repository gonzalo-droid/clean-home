"use client";

import { MinusIcon, PlusIcon } from "./icons";

export default function QuantityStepper({
  value,
  onChange,
  label,
  min = 1,
  size = "md",
}: {
  value: number;
  onChange: (value: number) => void;
  label: string;
  min?: number;
  size?: "sm" | "md";
}) {
  const btn = size === "sm" ? "h-9 w-9" : "h-11 w-11";
  return (
    <div className="inline-flex items-center rounded-full border border-linea bg-white">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        aria-label={`Restar cantidad de ${label}`}
        className={`${btn} flex items-center justify-center rounded-full text-marino hover:bg-menta`}
      >
        <MinusIcon className="h-4 w-4" />
      </button>
      <span className="w-7 text-center text-sm font-bold" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        aria-label={`Sumar cantidad de ${label}`}
        className={`${btn} flex items-center justify-center rounded-full text-marino hover:bg-menta`}
      >
        <PlusIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
