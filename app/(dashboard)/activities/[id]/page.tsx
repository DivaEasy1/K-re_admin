import { ActivityForm } from "@/components/activities/ActivityForm";

export default function EditActivityPage({ params }: { params: { id: string } }) {
  return <ActivityForm activityId={params.id} />;
}
