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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useActivity, useCreateActivity, useUpdateActivity } from "@/hooks/useActivities";
import { useStations } from "@/hooks/useStations";

const activitySchema = z.object({
  title: z.string().min(2, "Title is required."),
  description: z.string().min(20, "Description should be more detailed."),
  duration: z.string().min(2, "Duration is required."),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  price: z.string().min(2, "Price is required."),
  icon: z.string().min(1, "Add an emoji or short icon."),
  category: z.enum(["leisure", "nature", "gastronomy", "sport"]),
  stationId: z.string().min(1, "Please choose a station."),
  stationName: z.string().min(1, "Station name is required."),
  image: z.string().min(1, "Please upload a cover image.")
});

type ActivityFormValues = z.infer<typeof activitySchema>;

interface ActivityFormProps {
  activityId?: string;
}

export function ActivityForm({ activityId }: ActivityFormProps) {
  const router = useRouter();
  const { data: activity, isLoading } = useActivity(activityId ?? "");
  const { data: stations = [] } = useStations();
  const createActivity = useCreateActivity();
  const updateActivity = useUpdateActivity();
  const isEditing = Boolean(activityId);

  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      title: "",
      description: "",
      duration: "",
      difficulty: "EASY",
      price: "",
      icon: "🌊",
      category: "nature",
      stationId: "",
      stationName: "",
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
        icon: activity.icon,
        category: activity.category,
        stationId: activity.stationId,
        stationName: activity.stationName,
        image: activity.image
      });
    }
  }, [activity, form]);

  const onSubmit = async (values: ActivityFormValues) => {
    if (isEditing && activityId) {
      await updateActivity.mutateAsync({ id: activityId, values });
    } else {
      await createActivity.mutateAsync(values);
    }

    router.push("/activities");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="outline" asChild>
          <Link href="/activities">
            <ArrowLeft className="h-4 w-4" />
            Back to activities
          </Link>
        </Button>
        <Button form="activity-form" type="submit">
          {createActivity.isPending || updateActivity.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isEditing ? "Save changes" : "Create activity"}
        </Button>
      </div>

      <form id="activity-form" onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? "Edit activity" : "Create a new activity"}</CardTitle>
            <CardDescription>Build polished experience cards now, then connect them to live content later.</CardDescription>
          </CardHeader>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...form.register("title")} />
              <p className="text-sm text-red-500">{form.formState.errors.title?.message}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input id="duration" {...form.register("duration")} />
              <p className="text-sm text-red-500">{form.formState.errors.duration?.message}</p>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...form.register("description")} />
              <p className="text-sm text-red-500">{form.formState.errors.description?.message}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select id="difficulty" {...form.register("difficulty")}>
                <option value="EASY">EASY</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HARD">HARD</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input id="price" {...form.register("price")} />
              <p className="text-sm text-red-500">{form.formState.errors.price?.message}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <Input id="icon" {...form.register("icon")} />
              <p className="text-sm text-red-500">{form.formState.errors.icon?.message}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select id="category" {...form.register("category")}>
                <option value="leisure">leisure</option>
                <option value="nature">nature</option>
                <option value="gastronomy">gastronomy</option>
                <option value="sport">sport</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stationId">Station</Label>
              <Select
                id="stationId"
                value={form.watch("stationId")}
                onChange={(event) => {
                  const selected = stations.find((station) => station.id === event.target.value);
                  form.setValue("stationId", event.target.value, { shouldValidate: true });
                  form.setValue("stationName", selected?.name ?? "", { shouldValidate: true });
                }}
              >
                <option value="">Select a station</option>
                {stations.map((station) => (
                  <option key={station.id} value={station.id}>
                    {station.name}
                  </option>
                ))}
              </Select>
              <p className="text-sm text-red-500">{form.formState.errors.stationId?.message}</p>
            </div>
            <input type="hidden" {...form.register("stationName")} />
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hero image</CardTitle>
            <CardDescription>Use a premium visual so the catalog cards feel launch-ready in the preview.</CardDescription>
          </CardHeader>
          <div className="space-y-3">
            {isLoading && isEditing ? <p className="text-sm text-muted-foreground">Loading activity details...</p> : null}
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

