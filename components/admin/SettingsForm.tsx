"use client";

import { useState } from "react";
import { MessageCircle, Save, Check } from "lucide-react";

interface SettingsFormProps {
  settings: Record<string, string>;
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const [whatsapp, setWhatsapp] = useState(
    settings["whatsapp_number"] ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ""
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ whatsapp_number: whatsapp }),
    });

    setSaving(false);

    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      const json = await res.json();
      setError(json.error ?? "Error al guardar");
    }
  };

  return (
    <form onSubmit={handleSave} className="bg-white rounded-2xl border border-[#E5E5E5] p-6 space-y-6">
      {/* WhatsApp */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <MessageCircle className="w-4 h-4 text-[#25D366]" />
          <label className="text-sm font-semibold text-[#111111]">
            Número de WhatsApp
          </label>
        </div>
        <p className="text-xs text-[#666666] mb-3">
          Los clientes enviarán sus consultas a este número. Incluye código de país sin + ni espacios (ej: 521XXXXXXXXXX).
        </p>
        <input
          type="text"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          placeholder="521XXXXXXXXXX"
          className="w-full border border-[#E5E5E5] rounded-xl px-4 py-2.5 text-sm text-[#111111] focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/20 transition-all font-mono"
        />
        {whatsapp && (
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-xs text-[#25D366] hover:underline"
          >
            Probar enlace →
          </a>
        )}
      </div>

      {error && (
        <p className="text-sm text-[#D0021B] bg-red-50 border border-red-200 px-4 py-2 rounded-xl">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full py-3 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed bg-[#C9A84C] hover:bg-[#A6862A] text-white"
      >
        {saved ? (
          <><Check className="w-4 h-4" /> Guardado</>
        ) : saving ? (
          "Guardando..."
        ) : (
          <><Save className="w-4 h-4" /> Guardar cambios</>
        )}
      </button>
    </form>
  );
}
