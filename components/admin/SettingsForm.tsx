"use client";

import { useState } from "react";
import { MessageCircle, Save, Check, Phone } from "lucide-react";

interface SettingsFormProps {
  settings: Record<string, string>;
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const savedNumber = settings["whatsapp_number"] ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const [whatsapp, setWhatsapp] = useState(savedNumber);
  const [currentSaved, setCurrentSaved] = useState(savedNumber);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasChanges = whatsapp !== currentSaved;

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
      setCurrentSaved(whatsapp);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      const json = await res.json();
      setError(`Error: ${json.error ?? "desconocido"}${json.hint ? ` — ${json.hint}` : ""}`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Número actual */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5">
        <p className="text-xs font-semibold text-[#666666] uppercase tracking-wide mb-3">
          Número registrado actualmente
        </p>
        {currentSaved ? (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-[#25D366]" />
              </div>
              <div>
                <p className="font-mono font-semibold text-[#111111] text-base">+{currentSaved}</p>
                <p className="text-xs text-[#666666] mt-0.5">Mensajes de clientes llegan aquí</p>
              </div>
            </div>
            <a
              href={`https://wa.me/${currentSaved}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 text-xs font-medium text-[#25D366] bg-[#25D366]/10 px-3 py-1.5 rounded-lg hover:bg-[#25D366]/20 transition-colors"
            >
              Probar
            </a>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-[#666666]">
            <div className="w-10 h-10 rounded-full bg-[#F8F8F8] flex items-center justify-center">
              <Phone className="w-5 h-5 text-[#E5E5E5]" />
            </div>
            <p className="text-sm">Sin número configurado</p>
          </div>
        )}
      </div>

      {/* Formulario de edición */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-[#E5E5E5] p-5 space-y-4">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-[#25D366]" />
          <p className="text-sm font-semibold text-[#111111]">Cambiar número</p>
        </div>

        <div>
          <p className="text-xs text-[#666666] mb-2">
            Código de país sin + ni espacios (ej: <span className="font-mono">521XXXXXXXXXX</span>).
          </p>
          <input
            type="text"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ""))}
            placeholder="521XXXXXXXXXX"
            className="w-full border border-[#E5E5E5] rounded-xl px-4 py-2.5 text-sm text-[#111111] focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/20 transition-all font-mono"
          />
        </div>

        {error && (
          <p className="text-sm text-[#D0021B] bg-red-50 border border-red-200 px-4 py-2 rounded-xl">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={saving || !hasChanges || !whatsapp}
          className="w-full py-3 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed bg-[#C9A84C] hover:bg-[#A6862A] text-white"
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
    </div>
  );
}
