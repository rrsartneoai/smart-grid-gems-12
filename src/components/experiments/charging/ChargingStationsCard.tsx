import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ChargingStationsCardProps {
  city: string;
}

export const ChargingStationsCard: React.FC<ChargingStationsCardProps> = ({ city }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['chargingStations', city],
    queryFn: async () => {
      const response = await fetch(`/api/charging-stations/${city}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-4 w-[200px]" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[100px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Stacje ładowania</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Błąd podczas ładowania danych
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stacje ładowania</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data?.stations?.map((station: any) => (
            <div key={station.id} className="border p-4 rounded-lg">
              <h3 className="font-medium">{station.name}</h3>
              <p className="text-sm text-muted-foreground">
                {station.address}
              </p>
              <div className="mt-2">
                <span className="text-sm bg-green-100 dark:bg-green-900 px-2 py-1 rounded">
                  {station.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};