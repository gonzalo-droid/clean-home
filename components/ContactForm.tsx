"use client";

import { useState, type FormEvent } from "react";
import { buildContactMessageUrl } from "@/lib/whatsapp";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const url = buildContactMessageUrl(name, phone, message);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card flex flex-col gap-4 p-6"
    >
      <div>
        <label htmlFor="contact-name" className="mb-1 block text-sm font-semibold">
          Nombre
        </label>
        <input
          id="contact-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
        />
      </div>

      <div>
        <label htmlFor="contact-phone" className="mb-1 block text-sm font-semibold">
          Teléfono
        </label>
        <input
          id="contact-phone"
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="input"
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-1 block text-sm font-semibold">
          Mensaje
        </label>
        <textarea
          id="contact-message"
          required
          rows={4}
          style={{ paddingTop: 8, paddingBottom: 8 }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="input"
        />
      </div>

      <button
        type="submit"
        className="btn-primary min-h-[48px] text-base"
      >
        Enviar por WhatsApp
      </button>
    </form>
  );
}
