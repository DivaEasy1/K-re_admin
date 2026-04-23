"use client";

import Image from "next/image";
import { ImagePlus, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange?: (value: string) => void;
  onFileSelect?: (file: File | null, previewUrl: string) => void;
  mode?: "data-url" | "file";
}

export function ImageUpload({ value, onChange, onFileSelect, mode = "data-url" }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (file?: File) => {
    if (!file) {
      return;
    }

    if (mode === "file") {
      onFileSelect?.(file, URL.createObjectURL(file));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange?.(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        className={cn(
          "flex min-h-[220px] w-full flex-col items-center justify-center rounded-[28px] border border-dashed border-border bg-gradient-to-br from-white/70 to-ocean-50/70 p-6 text-center transition dark:from-slate-950/40 dark:to-slate-900/40",
          dragging && "border-primary bg-primary/5"
        )}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          handleFiles(event.dataTransfer.files?.[0]);
        }}
      >
        {value ? (
          <div className="w-full overflow-hidden rounded-[24px]">
            <Image src={value} alt="Preview" width={1200} height={640} className="h-56 w-full object-cover" unoptimized />
          </div>
        ) : (
          <>
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
              <UploadCloud className="h-8 w-8" />
            </div>
            <p className="font-display text-lg font-semibold">Drag and drop your image here</p>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Drop a hero visual for the station or click to upload from your computer.
            </p>
          </>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => handleFiles(event.target.files?.[0])}
      />
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <ImagePlus className="h-4 w-4 text-primary" />
        PNG, JPG, or WEBP. Perfect for mock previews while backend upload is pending.
      </div>
    </div>
  );
}
