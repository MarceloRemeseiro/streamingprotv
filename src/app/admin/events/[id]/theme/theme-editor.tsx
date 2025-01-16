"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import Image from 'next/image'

type Theme = {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  logoUrl?: string;
};

type StreamProvider = "CLOUDFLARE" | "YOUTUBE";
type StreamMode = "iframe" | "hls" | "dash";

type EventContent = {
  title: string;
  subtitle: string;
  description: string;
  streamProvider: StreamProvider;
  videoId: string;
  streamMode: StreamMode;
  isActive: boolean;
};

export default function ThemeEditor({ eventId }: { eventId: string }) {
  const router = useRouter();
  const [theme, setTheme] = useState<Theme>({
    primaryColor: "#000000",
    secondaryColor: "#ffffff",
    backgroundColor: "#ffffff",
    textColor: "#000000",
  });
  const [content, setContent] = useState<EventContent>({
    title: "",
    subtitle: "",
    description: "",
    streamProvider: "CLOUDFLARE",
    videoId: "",
    streamMode: "hls",
    isActive: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    async function loadEvent() {
      try {
        const response = await fetch(`/api/events/${eventId}`);
        const data = await response.json();
        if (data.theme) {
          setTheme(data.theme);
        }
        setContent({
          title: data.title || "",
          subtitle: data.subtitle || "",
          description: data.description || "",
          streamProvider: data.streamConfig?.provider || "CLOUDFLARE",
          videoId: data.streamConfig?.videoId || "",
          streamMode: data.streamConfig?.mode || "hls",
          isActive: data.isActive || false,
        });
      } catch (error) {
        console.error("Error loading event:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadEvent();
  }, [eventId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);

    console.log("Enviando configuración:", {
      streamConfig: {
        provider: content.streamProvider,
        videoId: content.videoId,
        mode: content.streamMode,
      },
    });

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          theme,
          title: content.title,
          subtitle: content.subtitle,
          description: content.description,
          isActive: content.isActive,
          streamConfig: {
            provider: content.streamProvider,
            videoId: content.videoId,
            mode: content.streamMode,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Error al guardar los cambios");
      }

      router.refresh();
    } catch (error) {
      console.error("Error saving:", error);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.[0]) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Error al subir el logo");

      const data = await response.json();
      setTheme((prev) => ({ ...prev, logoUrl: data.url }));
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsUploading(false);
    }
  }

  const handleStreamProviderChange = (provider: StreamProvider) => {
    setContent((prev) => ({
      ...prev,
      streamProvider: provider,
      // Si cambiamos a YouTube, forzamos modo iframe
      streamMode: provider === "YOUTUBE" ? "iframe" : prev.streamMode || "hls",
    }));
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Personalizar Tema</h2>
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-400 hover:text-white"
        >
          ← Volver
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
        <div>
            <label className="block text-sm font-medium text-gray-200">
              Logo del Evento
            </label>
            <div className="mt-1 flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="file"
                  onChange={handleLogoUpload}
                  accept="image/*"
                  className="mt-1 block w-full text-sm text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-medium
                    file:bg-gray-700 file:text-gray-300
                    hover:file:bg-gray-600"
                />
              </div>
              {isUploading && (
                <div className="text-sm text-gray-400">Subiendo...</div>
              )}
            </div>
            {theme.logoUrl && (
              <Image 
                src={theme.logoUrl} 
                alt="Logo del Evento"
                width={64}
                height={64}
                className="h-16 object-contain"
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Estado del Evento
            </label>
            <div className="flex items-center space-x-2">
              <Switch
                checked={content.isActive}
                onCheckedChange={(checked) =>
                  setContent({ ...content, isActive: checked })
                }
              />
              <span className="text-sm text-gray-300">
                {content.isActive ? "Evento en vivo" : "Evento offline"}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-400">
              Activa esta opción cuando el evento esté transmitiendo en vivo
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200">
              Color Principal
            </label>
            <div className="mt-1 flex items-center space-x-2">
              <input
                type="color"
                value={theme.primaryColor}
                onChange={(e) =>
                  setTheme({ ...theme, primaryColor: e.target.value })
                }
                className="h-8 w-8 rounded border border-gray-700"
              />
              <input
                type="text"
                value={theme.primaryColor}
                onChange={(e) =>
                  setTheme({ ...theme, primaryColor: e.target.value })
                }
                className="p-2 block w-full rounded-md border-gray-600 bg-gray-700 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200">
              Color Secundario
            </label>
            <div className="mt-1 flex items-center space-x-2">
              <input
                type="color"
                value={theme.secondaryColor}
                onChange={(e) =>
                  setTheme({ ...theme, secondaryColor: e.target.value })
                }
                className="h-8 w-8 rounded border border-gray-700"
              />
              <input
                type="text"
                value={theme.secondaryColor}
                onChange={(e) =>
                  setTheme({ ...theme, secondaryColor: e.target.value })
                }
                className="p-2 block w-full rounded-md border-gray-600 bg-gray-700 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200">
              Color de Fondo
            </label>
            <div className="mt-1 flex items-center space-x-2">
              <input
                type="color"
                value={theme.backgroundColor}
                onChange={(e) =>
                  setTheme({ ...theme, backgroundColor: e.target.value })
                }
                className="h-8 w-8 rounded border border-gray-700"
              />
              <input
                type="text"
                value={theme.backgroundColor}
                onChange={(e) =>
                  setTheme({ ...theme, backgroundColor: e.target.value })
                }
                className="p-2 block w-full rounded-md border-gray-600 bg-gray-700 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200">
              Color de Texto
            </label>
            <div className="mt-1 flex items-center space-x-2">
              <input
                type="color"
                value={theme.textColor}
                onChange={(e) =>
                  setTheme({ ...theme, textColor: e.target.value })
                }
                className="h-8 w-8 rounded border border-gray-700"
              />
              <input
                type="text"
                value={theme.textColor}
                onChange={(e) =>
                  setTheme({ ...theme, textColor: e.target.value })
                }
                className="p-2 block w-full rounded-md border-gray-600 bg-gray-700 text-white"
              />
            </div>
          </div>
         
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200">
            URL del Logo
          </label>
          <input
            type="text"
            value={theme.logoUrl || ""}
            onChange={(e) => setTheme({ ...theme, logoUrl: e.target.value })}
            className="mt-1 p-2 block w-full rounded-md border-gray-600 bg-gray-700 text-white"
            placeholder="https://ejemplo.com/logo.png"
          />
        </div>

        <div className="border-t border-gray-700 pt-6 mt-6">
          <h3 className="text-lg font-medium text-white mb-4">
            Contenido del Player
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200">
                Título del Player
              </label>
              <input
                type="text"
                value={content.title}
                onChange={(e) =>
                  setContent({ ...content, title: e.target.value })
                }
                className="mt-1 p-2 block w-full rounded-md border-gray-600 bg-gray-700 text-white"
                placeholder="Título que aparecerá en el player"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200">
                Subtítulo
              </label>
              <input
                type="text"
                value={content.subtitle}
                onChange={(e) =>
                  setContent({ ...content, subtitle: e.target.value })
                }
                className="mt-1 p-2 block w-full rounded-md border-gray-600 bg-gray-700 text-white"
                placeholder="Subtítulo del player"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200">
                Descripción
              </label>
              <textarea
                value={content.description}
                onChange={(e) =>
                  setContent({ ...content, description: e.target.value })
                }
                rows={3}
                className="mt-1 p-2 block w-full rounded-md border-gray-600 bg-gray-700 text-white"
                placeholder="Texto descriptivo que aparecerá en el player"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-200">
                Configuración del Stream
              </h3>

              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200">
                    Proveedor de Streaming
                  </label>
                  <select
                    value={content.streamProvider}
                    onChange={(e) =>
                      handleStreamProviderChange(
                        e.target.value as StreamProvider
                      )
                    }
                    className="mt-1 p-2 block w-full rounded-md border-gray-600 bg-gray-700 text-white"
                  >
                    <option value="CLOUDFLARE">Cloudflare Stream</option>
                    <option value="YOUTUBE">YouTube</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200">
                    URL del Stream
                  </label>
                  <input
                    type="text"
                    value={content.videoId}
                    onChange={(e) =>
                      setContent({ ...content, videoId: e.target.value })
                    }
                    className="mt-1 p-2 block w-full rounded-md border-gray-600 bg-gray-700 text-white"
                    placeholder={
                      content.streamProvider === "YOUTUBE"
                        ? "URL completa del video de YouTube"
                        : "URL completa del stream de Cloudflare (ej: https://customer-...cloudflarestream.com/VIDEO_ID)"
                    }
                  />
                  <p className="mt-1 text-sm text-gray-400">
                    {content.streamProvider === "YOUTUBE"
                      ? "Pega la URL completa del video de YouTube"
                      : "Pega la URL completa del stream de Cloudflare, incluyendo el dominio"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200">
                    Modo de Reproducción
                  </label>
                  <select
                    value={content.streamMode}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        streamMode: e.target.value as StreamMode,
                      })
                    }
                    className="mt-1 p-2 block w-full rounded-md border-gray-600 bg-gray-700 text-white"
                  >
                    <option value="iframe">iFrame (reproductor nativo)</option>
                    {content.streamProvider === "CLOUDFLARE" && (
                      <>
                        <option value="hls">HLS (mejor compatibilidad)</option>
                        <option value="dash">DASH (mejor calidad)</option>
                      </>
                    )}
                  </select>
                  <p className="mt-1 text-sm text-gray-400">
                    {content.streamMode === "iframe" &&
                      "Usa el reproductor nativo del proveedor"}
                    {content.streamMode === "hls" &&
                      "HLS ofrece mejor compatibilidad con dispositivos"}
                    {content.streamMode === "dash" &&
                      "DASH ofrece mejor calidad y control"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {isSaving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>

      {/* Preview */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-white mb-4">Vista Previa</h3>
        <div
          style={{
            backgroundColor: theme.backgroundColor,
            color: theme.textColor,
            padding: "2rem",
            borderRadius: "0.5rem",
          }}
        >
          <div className="flex items-center justify-between mb-6">
            {theme.logoUrl && (
              <Image 
                src={theme.logoUrl} 
                alt="Logo del Evento"
                width={64}
                height={64}
                className="h-16 object-contain"
              />
            )}
          </div>
          <h1 style={{ color: theme.primaryColor }}>Título de Ejemplo</h1>
          <p style={{ color: theme.textColor }}>
            Este es un texto de ejemplo para ver cómo se verán los colores en la
            página del evento.
          </p>
          <button
            style={{
              backgroundColor: theme.primaryColor,
              color: theme.secondaryColor,
              padding: "0.5rem 1rem",
              borderRadius: "0.25rem",
              border: "none",
            }}
          >
            Botón de Ejemplo
          </button>
        </div>
      </div>
    </div>
  );
}
