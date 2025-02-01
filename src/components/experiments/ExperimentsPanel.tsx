import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

export const ExperimentsPanel = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Mapa jakości powietrza - województwo pomorskie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video rounded-lg overflow-hidden bg-muted">
            <iframe
              src="https://airly.org/map/pl/#54.3520,18.6466,11"
              className="w-full h-full border-0"
              title="Mapa jakości powietrza"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}