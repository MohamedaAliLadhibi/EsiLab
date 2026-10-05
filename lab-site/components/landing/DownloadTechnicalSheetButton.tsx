'use client';

import { pdf } from '@react-pdf/renderer';
import { useState } from 'react';
import { FileText } from 'lucide-react';
import {
  TechnicalDataSheet,
  type DataSheetProduct,
} from './TechnicalDataSheet';

type Props = {
  product: DataSheetProduct;
  className?: string;
  variant?: 'button' | 'tile';
  label?: string;
};

/**
 * Fetch an image via our own /api/image-proxy route so CORS never blocks us.
 * Converts the result to a base64 data URL for @react-pdf/renderer.
 * Returns null if the fetch fails for any reason.
 */
async function toDataUrl(url: string): Promise<string | null> {
  try {
    const proxied = `/api/image-proxy?url=${encodeURIComponent(url)}`;
    const res = await fetch(proxied);
    if (!res.ok) {
      console.warn('[Fiche technique] Image proxy failed:', res.status, url);
      return null;
    }
    const blob = await res.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.warn('[Fiche technique] Image fetch failed:', url, err);
    return null;
  }
}

export function DownloadTechnicalSheetButton({
  product,
  className,
  variant = 'button',
  label = 'Fiche technique',
}: Props) {
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    if (busy) return;
    setBusy(true);
    try {
      // Pre-fetch the image so the PDF renderer never hits CORS
      let imageDataUrl: string | undefined;
      if (product.imageUrl && /^https?:\/\//.test(product.imageUrl)) {
        const dataUrl = await toDataUrl(product.imageUrl);
        if (dataUrl) imageDataUrl = dataUrl;
      }

      const blob = await pdf(
        <TechnicalDataSheet product={{ ...product, imageDataUrl }} />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const safeSku = (product.sku || product.name || 'fiche').replace(
        /[^a-zA-Z0-9-_]/g,
        '_'
      );
      a.download = `FicheTechnique-${safeSku}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('Erreur lors de la génération du PDF.');
    } finally {
      setBusy(false);
    }
  }

  if (variant === 'tile') {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={busy}
        className={
          className ??
          'group flex flex-col items-start rounded-2xl border border-blue/25 bg-blue/5 p-4 text-left transition hover:border-blue/50 hover:bg-blue/10 disabled:cursor-not-allowed disabled:opacity-50'
        }
      >
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue">
          <FileText size={14} />
          {busy ? 'Génération…' : label}
        </div>
        <p className="mt-2 text-sm font-semibold text-ink">
          {busy ? 'Préparation du PDF…' : 'Télécharger en PDF'}
        </p>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      className={
        className ??
        'inline-flex items-center justify-center gap-2 rounded-xl border border-blue/30 bg-white px-5 py-3.5 text-sm font-semibold text-blue transition hover:bg-blue/5 disabled:cursor-not-allowed disabled:opacity-50'
      }
    >
      <FileText size={16} />
      {busy ? 'Génération…' : label}
    </button>
  );
}