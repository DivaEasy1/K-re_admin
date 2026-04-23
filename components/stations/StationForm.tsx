"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { ImageUpload } from "@/components/stations/ImageUpload";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateStation, useStation, useUpdateStation } from "@/hooks/useStations";

const stationSchema = z.object({
  name: z.string().min(2, "Le nom de la station est requis."),
  location: z.string().min(2, "Le lieu est requis."),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  status: z.enum(["OPEN", "COMING_SOON", "CLOSED"]),
  openYear: z.coerce.number().min(2020).max(2035),
  description: z.string().min(20, "Ajoutez une description plus complete."),
  equipment: z.array(z.enum(["kayak_solo", "kayak_tandem", "paddle"])).min(1, "Selectionnez au moins un equipement."),
  image: z.string().min(1, "Ajoutez une image de couverture.")
});

type StationFormValues = z.infer<typeof stationSchema>;

const equipmentOptions = [
  { label: "Kayak solo", value: "kayak_solo" },
  { label: "Kayak tandem", value: "kayak_tandem" },
  { label: "Paddle", value: "paddle" }
] as const;

interface StationFormProps {
  stationId?: string;
}

export function StationForm({ stationId }: StationFormProps) {
  const router = useRouter();
  const { data: station, isLoading } = useStation(stationId ?? "");
  const createStation = useCreateStation();
  const updateStation = useUpdateStation();
  const isEditing = Boolean(stationId);

  const form = useForm<StationFormValues>({
    resolver: zodResolver(stationSchema),
    defaultValues: {
      name: "",
      location: "",
      latitude: 0,
      longitude: 0,
      status: "OPEN",
      openYear: 2026,
      description: "",
      equipment: ["kayak_solo"],
      image: ""
    }
  });

  useEffect(() => {
    if (station) {
      form.reset({
        name: station.name,
        location: station.location,
        latitude: station.latitude,
        longitude: station.longitude,
        status: station.status,
        openYear: station.openYear,
        description: station.description,
        equipment: station.equipment,
        image: station.image
      });
    }
  }, [form, station]);

  const onSubmit = async (values: StationFormValues) => {
    if (isEditing && stationId) {
      await updateStation.mutateAsync({ id: stationId, values });
    } else {
      await createStation.mutateAsync(values);
    }

    router.push("/stations");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="outline" asChild>
          <Link href="/stations">
            <ArrowLeft className="h-4 w-4" />
            Retour aux stations
          </Link>
        </Button>
        <Button form="station-form" type="submit">
          {createStation.isPending || updateStation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isEditing ? "Enregistrer" : "Creer la station"}
        </Button>
      </div>

      <form id="station-form" onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? "Modifier la station" : "Creer une nouvelle station"}</CardTitle>
            <CardDescription>Renseignez les informations de base pour preparer la fiche station.</CardDescription>
          </CardHeader>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input id="name" {...form.register("name")} />
              <p className="text-sm text-red-500">{form.formState.errors.name?.message}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Lieu</Label>
              <Input id="location" {...form.register("location")} />
              <p className="text-sm text-red-500">{form.formState.errors.location?.message}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input id="latitude" type="number" step="0.0001" {...form.register("latitude")} />
              <p className="text-sm text-red-500">{form.formState.errors.latitude?.message}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input id="longitude" type="number" step="0.0001" {...form.register("longitude")} />
              <p className="text-sm text-red-500">{form.formState.errors.longitude?.message}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select id="status" {...form.register("status")}>
                <option value="OPEN">Ouverte</option>
                <option value="COMING_SOON">Bientot</option>
                <option value="CLOSED">Fermee</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="openYear">Annee d&apos;ouverture</Label>
              <Input id="openYear" type="number" {...form.register("openYear")} />
              <p className="text-sm text-red-500">{form.formState.errors.openYear?.message}</p>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...form.register("description")} />
              <p className="text-sm text-red-500">{form.formState.errors.description?.message}</p>
            </div>
            <div className="space-y-3 md:col-span-2">
              <Label>Equipements</Label>
              <div className="grid gap-3 sm:grid-cols-3">
                {equipmentOptions.map((option) => {
                  const checked = form.watch("equipment").includes(option.value);

                  return (
                    <label
                      key={option.value}
                      className="flex items-center gap-3 rounded-2xl border border-border bg-white/60 px-4 py-3 dark:bg-slate-950/30"
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(nextChecked) => {
                          const current = form.getValues("equipment");
                          if (nextChecked) {
                            form.setValue("equipment", [...current, option.value], { shouldValidate: true });
                          } else {
                            form.setValue(
                              "equipment",
                              current.filter((value) => value !== option.value),
                              { shouldValidate: true }
                            );
                          }
                        }}
                      />
                      <span className="text-sm font-medium">{option.label}</span>
                    </label>
                  );
                })}
              </div>
              <p className="text-sm text-red-500">{form.formState.errors.equipment?.message}</p>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Image</CardTitle>
            <CardDescription>Ajoutez un visuel de couverture propre pour la liste et les fiches.</CardDescription>
          </CardHeader>
          <div className="space-y-3">
            {isLoading && isEditing ? <p className="text-sm text-muted-foreground">Chargement des details de la station...</p> : null}
            <Controller
              control={form.control}
              name="image"
              render={({ field }) => <ImageUpload value={field.value} onChange={field.onChange} />}
            />
            <p className="text-sm text-red-500">{form.formState.errors.image?.message}</p>
          </div>
        </Card>
      </form>
    </div>
  );
}
