"use client";

import React, { useCallback, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { ZoomIn, Loader2 } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { getCroppedImageFile, PixelCrop } from "@/lib/crop-image";

interface ImageCropModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  fileName?: string;
  onClose: () => void;
  onCropped: (file: File) => void | Promise<void>;
}

export function ImageCropModal({ isOpen, imageSrc, fileName = "profile.jpg", onClose, onCropped }: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<PixelCrop | null>(null);
  const [saving, setSaving] = useState(false);

  const handleCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleClose = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    onClose();
  };

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setSaving(true);
    try {
      const file = await getCroppedImageFile(imageSrc, croppedAreaPixels, fileName);
      await onCropped(file);
      handleClose();
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <Dialog isOpen={isOpen} onClose={handleClose} title="Crop Profile Picture">
      <div className="space-y-4">
        <div className="relative w-full h-72 rounded-xl overflow-hidden bg-slate-900">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="rect"
            showGrid
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>

        <div className="flex items-center gap-3">
          <ZoomIn className="size-4 text-muted-foreground flex-shrink-0" />
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-violet-600"
          />
        </div>

        <p className="text-xs text-muted-foreground text-center">Drag to reposition, use the slider to zoom. Your picture will be saved as a square.</p>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-border/40">
          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            className="px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted/50 transition-colors disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !croppedAreaPixels}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {saving && <Loader2 className="size-4 animate-spin" />}
            Save Picture
          </button>
        </div>
      </div>
    </Dialog>
  );
}
