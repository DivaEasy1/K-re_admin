import { ActivityForm } from "@/components/activities/ActivityForm";
import { useActivities } from "@/hooks/useActivities";
export const dynamicParams = false

export async function generateStaticParams() {
  // Return empty array for static export - will handle at runtime or pre-render key activities
  return [];
}

export default function EditActivityPage({ params }: { params: { id: string } }) {
  return <ActivityForm activityId={params.id} />;
}
