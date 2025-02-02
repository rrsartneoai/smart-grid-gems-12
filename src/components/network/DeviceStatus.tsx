import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

export function DeviceStatus() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Status urządzeń - Monitorowanie stanu urządzeń jakości powietrza
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>Wszystkie urządzenia są aktualnie online i monitorują jakość powietrza.</p>
        <ul className="list-disc pl-5">
          <li>Urządzenie 1: Online</li>
          <li>Urządzenie 2: Online</li>
          <li>Urządzenie 3: Offline</li>
          <li>Urządzenie 4: Online</li>
        </ul>
      </CardContent>
    </Card>
  );
}
