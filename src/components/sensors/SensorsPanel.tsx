import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sensorsData } from "./SensorsData";
import { DataComparison } from "./DataComparison";
import { AlertsConfig } from "./AlertsConfig";
import { ExportData } from "./ExportData";
import { CitySelector } from "./CitySelector";
import { DeviceStatus } from "../network/DeviceStatus";
import { SensorCard } from "./SensorCard";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";

export default function SensorsPanel() {
  const [selectedCity, setSelectedCity] = useState("gdansk");
  const { toast } = useToast();
  
  const cities = [
    { id: "gdansk", name: "Gdańsk" },
    { id: "gdynia", name: "Gdynia" },
    { id: "sopot", name: "Sopot" },
    { id: "slupsk", name: "Słupsk" },
    { id: "ustka", name: "Ustka" }
  ];

  const handleExport = () => {
    toast({
      title: "Eksport danych",
      description: "Rozpoczęto eksport danych...",
    });
  };

  // Add safety check for selected city data
  const selectedCityData = sensorsData[selectedCity];
  if (!selectedCityData) {
    return (
      <div className="p-4">
        <p>Nie znaleziono danych dla wybranego miasta.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DeviceStatus />
      <Card className="p-4">
        <div className="mb-4">
          <h2 className="text-2xl font-bold">Status urządzeń</h2>
          <p className="text-muted-foreground">Monitorowanie stanu urządzeń w sieci smart grid</p>
        </div>
        <Tabs defaultValue="data">
          <TabsList>
            <TabsTrigger value="data">Dane z czujników</TabsTrigger>
            <TabsTrigger value="comparison">Porównanie</TabsTrigger>
            <TabsTrigger value="alerts">Alerty</TabsTrigger>
            <TabsTrigger value="export">Eksport</TabsTrigger>
          </TabsList>
          <TabsContent value="data" className="sensors-panel">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Dane z Pomorskiego</h3>
              <div className="flex gap-2 flex-wrap">
                {cities.map((city) => (
                  <Button
                    key={city.id}
                    variant={selectedCity === city.id ? "default" : "outline"}
                    onClick={() => setSelectedCity(city.id)}
                    className="min-w-[100px]"
                  >
                    {city.name}
                  </Button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedCityData.sensors.map((sensor, index) => (
                <SensorCard key={index} {...sensor} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="comparison">
            <DataComparison />
          </TabsContent>
          <TabsContent value="alerts">
            <AlertsConfig />
          </TabsContent>
          <TabsContent value="export">
            <ExportData onExport={handleExport} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}