"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ImageUpload } from "@/components/stations/ImageUpload";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useActivity, useCreateActivity, useUpdateActivity, useUploadActivityImageFile } from "@/hooks/useActivities";

const activitySchema = z.object({
  title: z.string().min(2, "Le titre est requis."),
  description: z.string().min(10, "Ajoutez une description plus detaillee."),
  duration: z.string().min(2, "La duree est requise."),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  price: z.coerce.number().min(0.01, "Le prix doit etre superieur a 0."),
  priceLabel: z.string().min(1, "Le libelle de prix est requis."),
  icon: z.string().min(1, "Ajoutez une icone ou un emoji."),
  category: z.string().min(1, "La categorie est requise."),
  maxParticipants: z.coerce.number().min(1).max(50).default(10),
  image: z.union([z.literal(""), z.string().url("Ajoutez une image valide.")])
});

type ActivityFormValues = z.infer<typeof activitySchema>;

interface ActivityFormProps {
  activityId?: string;
}

export function ActivityForm({ activityId }: ActivityFormProps) {
  const router = useRouter();
  const { data: activity, isLoading } = useActivity(activityId ?? "");
  const createActivity = useCreateActivity();
  const updateActivity = useUpdateActivity();
  const uploadImage = useUploadActivityImageFile();
  const isEditing = Boolean(activityId);
  const [imagePreview, setImagePreview] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      title: "",
      description: "",
      duration: "",
      difficulty: "EASY",
      price: 0,
      priceLabel: "",
      icon: "🌊",
      category: "nature",
      maxParticipants: 10,
      image: ""
    }
  });

  useEffect(() => {
    if (activity) {
      form.reset({
        title: activity.title,
        description: activity.description,
        duration: activity.duration,
        difficulty: activity.difficulty,
        price: activity.price,
        priceLabel: activity.priceLabel,
        icon: activity.icon,
        category: activity.category,
        maxParticipants: activity.maxParticipants,
        image: activity.image ?? ""
      });
      setImagePreview(activity.image ?? "");
      setSelectedImageFile(null);
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    }
  }, [activity, form]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const onSubmit = async (values: ActivityFormValues) => {
    const payload = { ...values };

    if (selectedImageFile) {
      const uploaded = await uploadImage.mutateAsync(selectedImageFile);
      payload.image = uploaded.image;
    }

    if (isEditing && activityId) {
      await updateActivity.mutateAsync({ id: activityId, values: payload });
    } else {
      await createActivity.mutateAsync(payload);
    }

    router.push("/activities");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="outline" asChild>
          <Link href="/activities">
            <ArrowLeft className="h-4 w-4" />
            Retour aux activites
          </Link>
        </Button>
        <Button form="activity-form" type="submit">
          {createActivity.isPending || updateActivity.isPending || uploadImage.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isEditing ? "Enregistrer" : "Creer l'activite"}
        </Button>
      </div>

      <form id="activity-form" onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? "Modifier l'activite" : "Creer une nouvelle activite"}</CardTitle>
            <CardDescription>Renseignez les informations essentielles pour publier une activite coherente et complete.</CardDescription>
          </CardHeader>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input id="title" {...form.register("title")} />
              <p className="text-sm text-red-500">{form.formState.errors.title?.message}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duree</Label>
              <Input id="duration" {...form.register("duration")} />
              <p className="text-sm text-red-500">{form.formState.errors.duration?.message}</p>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...form.register("description")} />
              <p className="text-sm text-red-500">{form.formState.errors.description?.message}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="difficulty">Niveau</Label>
              <Select id="difficulty" {...form.register("difficulty")}>
                <option value="EASY">Facile</option>
                <option value="MEDIUM">Intermediaire</option>
                <option value="HARD">Difficile</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Prix</Label>
              <Input id="price" type="number" min="0" step="0.01" {...form.register("price")} />
              <p className="text-sm text-red-500">{form.formState.errors.price?.message}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon">Icone</Label>
              <Input id="icon" {...form.register("icon")} />
              <p className="text-sm text-red-500">{form.formState.errors.icon?.message}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categorie</Label>
              <Select id="category" {...form.register("category")}>
                <option value="leisure">Loisir</option>
                <option value="nature">Nature</option>
                <option value="gastronomy">Gastronomie</option>
                <option value="sport">Sport</option>
              </Select>
              <p className="text-sm text-red-500">{form.formState.errors.category?.message}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxParticipants">Participants max</Label>
              <Input id="maxParticipants" type="number" {...form.register("maxParticipants")} />
              <p className="text-sm text-red-500">{form.formState.errors.maxParticipants?.message}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priceLabel">Libelle de prix</Label>
              <Input id="priceLabel" {...form.register("priceLabel")} placeholder="Ex. A partir de 25 EUR" />
              <p className="text-sm text-red-500">{form.formState.errors.priceLabel?.message}</p>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Image de couverture</CardTitle>
            <CardDescription>Choisissez une image depuis l&apos;appareil. Elle sera televersee puis liee a l&apos;activite.</CardDescription>
          </CardHeader>
          <div className="space-y-3">
            {isLoading && isEditing ? <p className="text-sm text-muted-foreground">Chargement des details de l&apos;activite...</p> : null}
            <ImageUpload
              mode="file"
              value={imagePreview}
              onFileSelect={(file, previewUrl) => {
                if (!file) {
                  return;
                }

                if (objectUrlRef.current) {
                  URL.revokeObjectURL(objectUrlRef.current);
                }

                objectUrlRef.current = previewUrl;
                setSelectedImageFile(file);
                setImagePreview(previewUrl);
              }}
            />
            {imagePreview ? (
              <p className="text-xs text-muted-foreground break-all">
                {form.getValues("image") ? "Image actuelle conservee ou remplacee apres televersement." : "Nouvelle image prete a etre televersee."}
              </p>
            ) : null}
            <p className="text-sm text-red-500">{form.formState.errors.image?.message}</p>
          </div>
        </Card>
      </form>
    </div>
  );
}
