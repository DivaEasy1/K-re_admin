"use client";

import { useEffect, useRef, useState } from "react";
import { GripVertical, Trash2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  position: number;
}

interface ImageGalleryManagerProps {
  images: GalleryImage[];
  onImagesChange: (images: GalleryImage[]) => void;
  onUpload: (file: File) => Promise<GalleryImage>;
  isLoading?: boolean;
  disabled?: boolean;
  disabledMessage?: string;
  onRequestActivation?: () => Promise<boolean>;
}

export function ImageGalleryManager({
  images,
  onImagesChange,
  onUpload,
  isLoading,
  disabled,
  disabledMessage,
  onRequestActivation
}: ImageGalleryManagerProps) {
  const [dragging, setDragging] = useState<string | null>(null);
  const [isDropTarget, setIsDropTarget] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [shouldOpenPicker, setShouldOpenPicker] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!disabled && shouldOpenPicker) {
      inputRef.current?.click();
      setShouldOpenPicker(false);
    }
  }, [disabled, shouldOpenPicker]);

  const uploadFiles = async (files: File[]) => {
    if (files.length === 0 || disabled) {
      return;
    }

    setUploading(true);

    try {
      const nextImages = [...images];

      for (const file of files) {
        const newImage = await onUpload(file);
        nextImages.push(newImage);
      }

      onImagesChange(nextImages);
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.currentTarget.files;

    if (!files) {
      return;
    }

    try {
      await uploadFiles(Array.from(files));
    } finally {
      event.currentTarget.value = "";
    }
  };

  const handleUploadAreaClick = async () => {
    if (uploading || isLoading) {
      return;
    }

    if (disabled) {
      const activated = await onRequestActivation?.();

      if (activated) {
        setShouldOpenPicker(true);
      }

      return;
    }

    inputRef.current?.click();
  };

  const handleRemove = (imageId: string) => {
    onImagesChange(images.filter((image) => image.id !== imageId));
  };

  const handleAltChange = (imageId: string, alt: string) => {
    onImagesChange(images.map((image) => (image.id === imageId ? { ...image, alt } : image)));
  };

  const handleDragStart = (event: React.DragEvent, imageId: string) => {
    setDragging(imageId);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleUploadDragOver = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!disabled && !uploading && !isLoading) {
      setIsDropTarget(true);
      event.dataTransfer.dropEffect = "copy";
    }
  };

  const handleUploadDragLeave = (event: React.DragEvent<HTMLButtonElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsDropTarget(false);
    }
  };

  const handleUploadDrop = async (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsDropTarget(false);

    if (disabled || uploading || isLoading) {
      return;
    }

    await uploadFiles(Array.from(event.dataTransfer.files));
  };

  const handleDrop = (event: React.DragEvent, targetId: string) => {
    event.preventDefault();

    if (!dragging || dragging === targetId) {
      return;
    }

    const draggedIndex = images.findIndex((image) => image.id === dragging);
    const targetIndex = images.findIndex((image) => image.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) {
      return;
    }

    const reorderedImages = [...images];
    [reorderedImages[draggedIndex], reorderedImages[targetIndex]] = [
      reorderedImages[targetIndex],
      reorderedImages[draggedIndex]
    ];

    onImagesChange(
      reorderedImages.map((image, index) => ({
        ...image,
        position: index
      }))
    );
    setDragging(null);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium">Galerie d&apos;images</label>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileUpload}
          disabled={disabled || uploading || isLoading}
          className="hidden"
          id="gallery-upload"
        />
        <button
          type="button"
          onClick={handleUploadAreaClick}
          onDragOver={handleUploadDragOver}
          onDragLeave={handleUploadDragLeave}
          onDrop={handleUploadDrop}
          className={cn(
            "block w-full rounded-2xl border-2 border-dashed p-6 text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            disabled
              ? "border-slate-300/80 bg-slate-50/70 text-slate-500 hover:border-slate-400"
              : "border-ocean-200 bg-gradient-to-br from-white to-ocean-50/70 hover:border-ocean-400 hover:shadow-soft",
            isDropTarget && "border-ocean-500 bg-ocean-50 shadow-soft"
          )}
        >
          <Upload
            className={cn(
              "mx-auto mb-3 h-9 w-9 transition",
              disabled ? "text-slate-400" : "text-ocean-500",
              isDropTarget && "scale-110 text-ocean-600"
            )}
          />
          <p className="text-sm font-medium text-slate-700">
            {disabled
              ? disabledMessage || "Enregistrez d'abord la station pour gerer la galerie"
              : uploading
                ? "Telechargement en cours..."
                : "Cliquez pour ajouter des images"}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            {disabled ? "La station sera creee avant l'ouverture du selecteur." : "Vous pouvez aussi glisser-deposer vos fichiers ici."}
          </p>
        </button>
      </div>

      {images.length > 0 ? (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Images ({images.length})</h3>
          <div className="space-y-2">
            {images.map((image) => (
              <div
                key={image.id}
                draggable
                onDragStart={(event) => handleDragStart(event, image.id)}
                onDragOver={handleDragOver}
                onDrop={(event) => handleDrop(event, image.id)}
                className={`flex cursor-move gap-3 rounded-lg border p-3 transition ${
                  dragging === image.id ? "border-blue-300 bg-blue-50 opacity-50" : "hover:bg-gray-50"
                }`}
              >
                <button type="button" className="flex-shrink-0 text-gray-400 hover:text-gray-600">
                  <GripVertical className="h-5 w-5" />
                </button>

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  alt={image.alt}
                  className="h-16 w-16 flex-shrink-0 rounded object-cover"
                />

                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Texte alternatif (alt)"
                    value={image.alt}
                    onChange={(event) => handleAltChange(image.id, event.target.value)}
                    className="text-sm"
                  />
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(image.id)}
                  className="flex-shrink-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
