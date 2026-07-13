"use client";

import { CATEGORIES, type Category } from "@/data/products";

export default function CategoryFilter({
  active,
  onChange,
}: {
  active: Category | "todas";
  onChange: (value: Category | "todas") => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onChange("todas")}
        className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
          active === "todas" ? "bg-sky-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-sky-50"
        }`}
      >
        Todas
      </button>
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onChange(cat.id)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            active === cat.id ? "bg-sky-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-sky-50"
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
