import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Bike } from "lucide-react";

interface BikeStationsCardProps {
  city: string;
}

export const BikeStationsCard: React.FC<BikeStationsCardProps> = ({ city }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["bikeStations", city],
    queryFn: async () => {
      const response = await fetch(`/api/bike-stations/${city}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[160px]" />
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <Bike className="h-12 w-12 text-muted-foreground" />
          <div>
            <h3 className="text-lg font-medium">Stacje rowerowe</h3>
            <p className="text-sm text-muted-foreground">Błąd ładowania danych</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-4">
        <Bike className="h-12 w-12 text-primary" />
        <div>
          <h3 className="text-lg font-medium">Stacje rowerowe</h3>
          <p className="text-sm text-muted-foreground">
            {data?.totalStations || 0} stacji dostępnych
          </p>
        </div>
      </div>
    </Card>
  );
};