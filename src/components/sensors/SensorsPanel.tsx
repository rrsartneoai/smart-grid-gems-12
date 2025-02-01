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

export default function SensorsPanel() {
  const [selectedCity, setSelectedCity] = useState("gdansk");
  const { toast } = useToast();
  
  // Get cities from sensorsData, with error handling
  const cities = Object.keys(sensorsData || {}).map(city => 
    sensorsData[city]?.name || city
  );

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
        <Tabs defaultValue="data">
          <TabsList>
            <TabsTrigger value="data">Dane z czujników</TabsTrigger>
            <TabsTrigger value="comparison">Porównanie</TabsTrigger>
            <TabsTrigger value="alerts">Alerty</TabsTrigger>
            <TabsTrigger value="export">Eksport</TabsTrigger>
          </TabsList>
          <TabsContent value="data" className="sensors-panel">
            <CitySelector 
              cities={cities}
              selectedCity={selectedCity}
              onCitySelect={setSelectedCity}
            />
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