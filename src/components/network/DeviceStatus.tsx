
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Power, 
  Zap, 
  DollarSign, 
  Fuel,
  Activity,
  Gauge,
  Signal,
  Clock
} from "lucide-react";

export function DeviceStatus() {
  const metrics = [
    {
      icon: <Power className="w-5 h-5" />,
      label: "Ładunek",
      value: "15,234",
      unit: "MW",
      status: "Good",
      change: "+7.2% od ostatniego dnia",
      progress: 85
    },
    {
      icon: <Zap className="w-5 h-5" />,
      label: "Obciążenie netto",
      value: "14,123",
      unit: "MW",
      status: "Good",
      change: "-1.5% od ostatniej godziny",
      progress: 75
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      label: "Cena",
      value: "30.50",
      unit: "/MWh",
      status: "Good",
      change: "+1.2% od ostatniego odczytu",
      progress: 65
    },
    {
      icon: <Fuel className="w-5 h-5" />,
      label: "Główne źródło",
      value: "Węgiel",
      status: "Good",
      change: "60% udziału w miksie",
      progress: 60
    },
    {
      icon: <Activity className="w-5 h-5" />,
      label: "Częstotliwość sieci",
      value: "50.02",
      unit: "Hz",
      status: "Good",
      change: "Stabilna częstotliwość w normie",
      progress: 92
    },
    {
      icon: <Gauge className="w-5 h-5" />,
      label: "Napięcie fazowe",
      value: "230.5",
      unit: "V",
      status: "Good",
      change: "Optymalne napięcie w sieci",
      progress: 88
    },
    {
      icon: <Signal className="w-5 h-5" />,
      label: "Jakość sygnału",
      value: "98.5",
      unit: "%",
      status: "Good",
      change: "Wysoka jakość transmisji danych",
      progress: 98
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: "Czas odpowiedzi",
      value: "12",
      unit: "ms",
      status: "Good",
      change: "Szybka komunikacja z urządzeniami",
      progress: 95
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="bg-[#0A0F1C] border-[#1F2937] hover:bg-[#111827] transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  {metric.icon}
                  <span className="text-sm">{metric.label}</span>
                </div>
                <Badge 
                  variant="outline" 
                  className="bg-green-500/10 text-green-500 border-green-500/20"
                >
                  {metric.status}
                </Badge>
              </div>
              <div className="space-y-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">{metric.value}</span>
                  {metric.unit && (
                    <span className="text-sm text-muted-foreground">
                      {metric.unit}
                    </span>
                  )}
                </div>
                <Progress value={metric.progress} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  {metric.change}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
