import { StationForm } from "@/components/stations/StationForm";

export default function EditStationPage({ params }: { params: { id: string } }) {
  return <StationForm stationId={params.id} />;
}

