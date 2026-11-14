"use client";

import { useState, type FormEvent } from "react";
import { buildWhatsAppTextUrl } from "@/lib/whatsapp";
import { WhatsAppGlyph } from "@/components/icons";

const BUSINESS_TYPES = ["Bodega / minimarket", "Oficina", "Restaurante / cafetería", "Hotel / hospedaje", "Colegio / institución", "Otro"];

export default function WholesaleForm() {
  const [name, setName] = useState("");
  const [business, setBusiness] = useState(BUSINESS_TYPES[0]);
  const [city, setCity] = useState("");
  const [needs, setNeeds] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const text = [
      "Hola, quiero cotizar como mayorista.",
      "",
      `Nombre / empresa: ${name}`,
      `Tipo de negocio: ${business}`,
      `Distrito / ciudad: ${city}`,
      "",
      `Productos y cantidades: ${needs}`,
    ].join("\n");
    window.open(buildWhatsAppTextUrl(text), "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={handleSubmit} className="card flex flex-col gap-4 p-6">
      <h2 className="font-display text-3xl font-extrabold leading-none text-marino">Pide tu cotización</h2>
      <label className="flex flex-col gap-1 text-sm font-semibold">
        Nombre o empresa
        <input required className="input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="organization" />
      </label>
      <label className="flex flex-col gap-1 text-sm font-semibold">
        Tipo de negocio
        <select className="input" value={business} onChange={(e) => setBusiness(e.target.value)}>
          {BUSINESS_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm font-semibold">
        Distrito / ciudad
        <input required className="input" value={city} onChange={(e) => setCity(e.target.value)} />
      </label>
      <label className="flex flex-col gap-1 text-sm font-semibold">
        ¿Qué productos y cantidades necesitas?
        <textarea required rows={4} className="input py-2" value={needs} onChange={(e) => setNeeds(e.target.value)} placeholder="Ej. 10 paquetes de papel higiénico jumbo, 5 lejías de 4 L…" />
      </label>
      <button type="submit" className="btn-wa min-h-[48px] text-base">
        <WhatsAppGlyph className="h-5 w-5" /> Enviar por WhatsApp
      </button>
    </form>
  );
}
