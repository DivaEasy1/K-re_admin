/* eslint-disable @next/next/no-img-element */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { ImageGalleryManager } from "@/components/stations/ImageGalleryManager";
import { RichTextEditor } from "@/components/stations/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateStation, useStation, useUpdateStation } from "@/hooks/useStations";
import { api } from "@/lib/api";
import { resolveApiAssetUrl } from "@/lib/media";
import type { StationImage, StationStatus } from "@/types";

const stationSchema = z.object({
  name: z.string().trim().min(2, "Le nom est requis."),
  location: z.string().trim().min(2, "La localisation est requise."),
  lat: z.coerce.number().min(-90).max(90, "Latitude invalide."),
  lng: z.coerce.number().min(-180).max(180, "Longitude invalide."),
  description: z.string().trim().min(10, "La description est trop courte."),
  richContent: z.string().optional(),
  equipment: z.array(z.enum(["kayak_solo", "kayak_tandem", "paddle"])).optional(),
  status: z.enum(["OPEN", "COMING_SOON", "CLOSED", "MAINTENANCE"]),
  openYear: z.coerce.number().min(2020).max(2050).optional().nullable(),
  image: z.union([z.literal(""), z.string().url("Ajoutez une image valide.")]).optional().nullable(),
  bookingUrl: z.union([z.literal(""), z.string().url("Entrez une URL valide.")]).optional().nullable()
});

type StationFormValues = z.infer<typeof stationSchema>;

interface StationFormProps {
  stationId?: string;
}

function toNumberOrFallback(value: unknown, fallback: number) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const normalized = Number(value);

    if (Number.isFinite(normalized)) {
      return normalized;
    }
  }

  return fallback;
}

function buildDraftPayload(values: Partial<Record<keyof StationFormValues, unknown>>) {
  const draftName =
    typeof values.name === "string" && values.name.trim().length >= 2
      ? values.name.trim()
      : `Nouvelle station ${new Date().getTime()}`;

  const draftLocation =
    typeof values.location === "string" && values.location.trim().length >= 2
      ? values.location.trim()
      : "Localisation a definir";

  const draftDescription =
    typeof values.description === "string" && values.description.trim().length >= 10
      ? values.description.trim()
      : "Station en preparation. Les informations detaillees seront ajoutees prochainement.";

  const draftRichContent =
    typeof values.richContent === "string" && values.richContent.trim().length > 0
      ? values.richContent.trim()
      : undefined;

  const draftEquipment = Array.isArray(values.equipment) && values.equipment.length > 0
    ? values.equipment
    : undefined;

  const draftStatus =
    values.status === "OPEN" ||
    values.status === "COMING_SOON" ||
    values.status === "CLOSED" ||
    values.status === "MAINTENANCE"
      ? values.status
      : "COMING_SOON";

  const imageValue =
    typeof values.image === "string" && values.image.trim().length > 0 ? values.image.trim() : null;

  const openYear = toNumberOrFallback(values.openYear, new Date().getFullYear());

  return {
    name: draftName,
    location: draftLocation,
    lat: toNumberOrFallback(values.lat, 46.1789),
    lng: toNumberOrFallback(values.lng, -1.3856),
    description: draftDescription,
    richContent: draftRichContent,
    equipment: draftEquipment,
    status: draftStatus as StationStatus,
    openYear,
    image: imageValue
  };
}

function toPayload(values: StationFormValues) {
  return {
    name: values.name.trim(),
    location: values.location.trim(),
    lat: values.lat,
    lng: values.lng,
    description: values.description.trim(),
    richContent: values.richContent?.trim() || null,
    equipment: values.equipment && values.equipment.length > 0 ? values.equipment : null,
    status: values.status as StationStatus,
    openYear: values.openYear ?? undefined,
    image: values.image?.trim() || null,
    bookingUrl: values.bookingUrl?.trim() || null
  };
}

export function StationForm({ stationId }: StationFormProps) {
  const router = useRouter();
  const [persistedStationId, setPersistedStationId] = useState(stationId ?? "");
  const [gallery, setGallery] = useState<StationImage[]>([]);
  const [isPreparingGallery, setIsPreparingGallery] = useState(false);
  const activeStationId = stationId ?? persistedStationId;
  const isEditing = Boolean(activeStationId);
  const { data: station, isLoading: isLoadingStation } = useStation(activeStationId);
  const createStation = useCreateStation();
  const updateStation = useUpdateStation();

  const form = useForm<StationFormValues>({
    resolver: zodResolver(stationSchema),
    defaultValues: {
      name: "",
      location: "",
      lat: 46.1789,
      lng: -1.3856,
      description: "",
      richContent: "",
      equipment: [],
      status: "COMING_SOON",
      openYear: new Date().getFullYear(),
      image: "",
      bookingUrl: ""
    }
  });

  useEffect(() => {
    if (!stationId) {
      return;
    }

    setPersistedStationId(stationId);
  }, [stationId]);

  useEffect(() => {
    if (!station) {
      return;
    }

    form.reset({
      name: station.name,
      location: station.location,
      lat: station.lat,
      lng: station.lng,
      description: station.description,
      richContent: station.richContent ?? "",
      equipment: station.equipment ?? [],
      status: station.status,
      openYear: station.openYear ?? new Date().getFullYear(),
      image: station.image ?? "",
      bookingUrl: station.bookingUrl ?? ""
    });
    setGallery(station.gallery ?? []);
  }, [form, station]);

  const syncCreatedStation = (createdStation: { id: string; gallery?: StationImage[] }) => {
    setPersistedStationId(createdStation.id);
    setGallery(createdStation.gallery ?? []);

    if (typeof window !== "undefined" && window.location.pathname.endsWith("/stations/new")) {
      window.history.replaceState(window.history.state, "", `/stations/${createdStation.id}`);
    }
  };

  const createStationDraft = async (values: Partial<Record<keyof StationFormValues, unknown>>) => {
    const payload = buildDraftPayload(values);
    const createdStation = await createStation.mutateAsync(payload);
    syncCreatedStation(createdStation);
    return createdStation;
  };

  const onSubmit = async (values: StationFormValues) => {
    if (activeStationId) {
      await updateStation.mutateAsync({ id: activeStationId, values: toPayload(values) });
    } else {
      const createdStation = await createStation.mutateAsync(toPayload(values));
      syncCreatedStation(createdStation);
      toast.success("Station creee avec succes.");
    }

    router.push("/stations");
    router.refresh();
  };

  const handleGalleryActivation = async () => {
    if (activeStationId) {
      return true;
    }

    try {
      setIsPreparingGallery(true);
      const values = form.getValues();
      await createStationDraft(values);
      return true;
    } catch (error) {
      console.error("Failed to prepare gallery:", error);
      toast.error("Impossible de creer la station brouillon.");
      return false;
    } finally {
      setIsPreparingGallery(false);
    }
  };

  const handleImageUpload = async (file: File): Promise<StationImage> => {
    if (!activeStationId) {
      throw new Error("Enregistrez d'abord la station avant d'ajouter des images.");
    }

    const formData = new FormData();
    formData.append("images", file);
    formData.append("stationId", activeStationId);

    const response = await api.post("/stations/images/upload-batch", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    const uploadedImages = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
    const uploadedImage = uploadedImages[0] as StationImage;

    const normalizedImage = {
      ...uploadedImage,
      url: resolveApiAssetUrl(uploadedImage.url) ?? uploadedImage.url
    };

    const currentCover = form.getValues("image");
    if (!currentCover) {
      form.setValue("image", normalizedImage.url, { shouldDirty: true });
    }

    return normalizedImage;
  };

  const isSubmitting = createStation.isPending || updateStation.isPending || isPreparingGallery;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="outline" asChild>
          <Link href="/stations">
            <ArrowLeft className="h-4 w-4" />
            Retour aux stations
          </Link>
        </Button>
        <Button form="station-form" type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isEditing ? "Enregistrer" : "Creer la station"}
        </Button>
      </div>

      <form id="station-form" onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{isEditing ? "Modifier la station" : "Creer une nouvelle station"}</CardTitle>
              <CardDescription>Renseignez les informations principales avant de publier votre premier point de depart.</CardDescription>
            </CardHeader>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">Nom</Label>
                <Input id="name" placeholder="Nom de la station" {...form.register("name")} />
                <p className="text-sm text-red-500">{form.formState.errors.name?.message}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Localisation</Label>
                <Input id="location" placeholder="Ville ou adresse" {...form.register("location")} />
                <p className="text-sm text-red-500">{form.formState.errors.location?.message}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select id="status" {...form.register("status")}>
                  <option value="OPEN">Ouverte</option>
                  <option value="COMING_SOON">Bientot</option>
                  <option value="CLOSED">Fermee</option>
                  <option value="MAINTENANCE">Maintenance</option>
                </Select>
              </div>

              {form.watch("status") === "OPEN" && (
                <div className="space-y-2">
                  <Label htmlFor="bookingUrl">URL de la station</Label>
                  <Input id="bookingUrl" placeholder="https://..." {...form.register("bookingUrl")} />
                  <p className="text-sm text-red-500">{form.formState.errors.bookingUrl?.message}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="lat">Latitude</Label>
                <Input id="lat" type="number" step="0.0001" {...form.register("lat")} />
                <p className="text-sm text-red-500">{form.formState.errors.lat?.message}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lng">Longitude</Label>
                <Input id="lng" type="number" step="0.0001" {...form.register("lng")} />
                <p className="text-sm text-red-500">{form.formState.errors.lng?.message}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="openYear">Annee d&apos;ouverture</Label>
                <Input id="openYear" type="number" min="2020" max="2050" {...form.register("openYear")} />
                <p className="text-sm text-red-500">{form.formState.errors.openYear?.message}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image de couverture</Label>
                <div className="flex gap-2">
                  <Input id="image" placeholder="https://..." {...form.register("image")} className="flex-1" />
                  {gallery.length > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (gallery.length > 0) {
                          form.setValue("image", gallery[0].url, { shouldDirty: true });
                        }
                      }}
                      title="Utiliser la première image de la galerie comme couverture"
                    >
                      Utiliser galerie
                    </Button>
                  )}
                </div>
                {gallery.length > 0 && (
                  <div className="mt-2 space-y-2">
                    <p className="text-xs font-medium text-slate-600">Ou sélectionner de la galerie:</p>
                    <div className="grid gap-2 grid-cols-4 sm:grid-cols-5">
                      {gallery.map((img) => (
                        <button
                          key={img.id}
                          type="button"
                          onClick={() => {
                            form.setValue("image", img.url, { shouldDirty: true });
                          }}
                          className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                            form.watch("image") === img.url
                              ? "border-ocean-500 shadow-md"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <img
                            src={img.url}
                            alt={img.alt || "Galerie"}
                            className="h-full w-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <p className="text-sm text-red-500">{form.formState.errors.image?.message}</p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description courte</Label>
                <Textarea
                  id="description"
                  placeholder="Description de la station..."
                  className="min-h-[150px]"
                  {...form.register("description")}
                />
                <p className="text-sm text-red-500">{form.formState.errors.description?.message}</p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Materiel disponible</Label>
                <div className="space-y-3">
                  {["kayak_solo", "kayak_tandem", "paddle"].map((equipmentType) => {
                    const labels: Record<string, string> = {
                      kayak_solo: "Kayak solo",
                      kayak_tandem: "Kayak tandem",
                      paddle: "Paddle"
                    };
                    const isChecked = form.watch("equipment")?.includes(equipmentType as any) ?? false;
                    return (
                      <div key={equipmentType} className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id={equipmentType}
                          checked={isChecked}
                          onChange={(e) => {
                            const currentEquipment = form.getValues("equipment") ?? [];
                            if (e.target.checked) {
                              form.setValue("equipment", [...currentEquipment, equipmentType as any], { shouldDirty: true });
                            } else {
                              form.setValue("equipment", currentEquipment.filter((item) => item !== equipmentType), { shouldDirty: true });
                            }
                          }}
                          className="h-4 w-4 rounded border-slate-300 cursor-pointer"
                        />
                        <Label htmlFor={equipmentType} className="cursor-pointer">
                          {labels[equipmentType] || equipmentType}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contenu detaille</CardTitle>
              <CardDescription>
                Structurez le contenu avec des titres, listes et mises en avant pour une page station plus claire.
              </CardDescription>
            </CardHeader>
            <div className="p-6">
              <RichTextEditor
                value={form.watch("richContent")}
                onChange={(content) => form.setValue("richContent", content, { shouldDirty: true })}
              />
            </div>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Galerie</CardTitle>
            <CardDescription>
              {isEditing
                ? "Ajoutez des images supplementaires pour illustrer la station."
                : "Remplissez les informations ci-dessus et cliquez sur 'Creer la station' pour pouvoir ajouter des images."}
            </CardDescription>
          </CardHeader>
          <div className="space-y-3 p-6">
            {isEditing && isLoadingStation ? (
              <p className="text-sm text-muted-foreground">Chargement des details de la station...</p>
            ) : null}
            <ImageGalleryManager
              images={gallery}
              onImagesChange={setGallery}
              onUpload={handleImageUpload}
              isLoading={isSubmitting}
              disabled={!activeStationId}
              disabledMessage="Creez la station d'abord pour ajouter des images."
              onRequestActivation={handleGalleryActivation}
            />
          </div>
        </Card>
      </form>
    </div>
  );
}
