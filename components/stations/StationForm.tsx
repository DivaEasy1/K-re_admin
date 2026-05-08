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
  name: z.string().min(2, "Le nom est requis."),
  location: z.string().min(2, "La localisation est requise."),
  lat: z.coerce.number().min(-90).max(90, "Latitude invalide."),
  lng: z.coerce.number().min(-180).max(180, "Longitude invalide."),
  description: z.string().min(10, "La description est trop courte."),
  richContent: z.string().optional(),
  status: z.enum(["OPEN", "COMING_SOON", "CLOSED", "MAINTENANCE"]),
  openYear: z.coerce.number().min(2020).max(2050).optional().nullable(),
  image: z.union([z.literal(""), z.string().url("Ajoutez une image valide.")]).optional().nullable()
});

type StationFormValues = z.infer<typeof stationSchema>;

interface StationFormProps {
  stationId?: string;
}

function toPayload(values: StationFormValues) {
  return {
    name: values.name,
    location: values.location,
    lat: values.lat,
    lng: values.lng,
    description: values.description,
    richContent: values.richContent?.trim() || undefined,
    status: values.status as StationStatus,
    openYear: values.openYear ?? undefined,
    image: values.image?.trim() || null
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
      status: "COMING_SOON",
      openYear: new Date().getFullYear(),
      image: ""
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
      status: station.status,
      openYear: station.openYear ?? new Date().getFullYear(),
      image: station.image ?? ""
    });
    setGallery(station.gallery ?? []);
  }, [form, station]);

  const createDraftStation = async (values: StationFormValues) => {
    const createdStation = await createStation.mutateAsync(toPayload(values));
    setPersistedStationId(createdStation.id);
    setGallery(createdStation.gallery ?? []);

    if (typeof window !== "undefined" && window.location.pathname.endsWith("/stations/new")) {
      window.history.replaceState(window.history.state, "", `/stations/${createdStation.id}`);
    }

    return createdStation;
  };

  const onSubmit = async (values: StationFormValues) => {
    if (activeStationId) {
      await updateStation.mutateAsync({ id: activeStationId, values: toPayload(values) });
    } else {
      await createDraftStation(values);
    }

    router.push("/stations");
    router.refresh();
  };

  const handleGalleryActivation = async () => {
    if (activeStationId) {
      return true;
    }

    const isValid = await form.trigger();

    if (!isValid) {
      toast.error("Renseignez les champs requis avant d'ajouter des images.");
      return false;
    }

    setIsPreparingGallery(true);

    try {
      await createDraftStation(form.getValues());
      return true;
    } catch {
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

    return {
      ...uploadedImage,
      url: resolveApiAssetUrl(uploadedImage.url) ?? uploadedImage.url
    };
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
                <Input id="image" placeholder="https://..." {...form.register("image")} />
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
                : "Un clic ici enregistre la station puis active aussitot la galerie."}
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
              disabledMessage="Cliquez pour enregistrer la station et activer la galerie."
              onRequestActivation={handleGalleryActivation}
            />
          </div>
        </Card>
      </form>
    </div>
  );
}
