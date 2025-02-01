import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";

export const NetworkMap = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Mapa sieci czujników jakości powietrza
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-video rounded-lg overflow-hidden bg-muted">
          <iframe
            src="https://airly.org/map/pl/#54.3520,18.6466,10"
            className="w-full h-full border-0"
            title="Mapa sieci czujników"
          />
        </div>
      </CardContent>
    </Card>
  );
};