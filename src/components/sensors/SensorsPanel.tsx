
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sensorsData } from "./SensorsData";
import { DataComparison } from "./DataComparison";
import { AlertsConfig } from "./AlertsConfig";
import { CitySelector } from "./CitySelector";
import { DeviceStatus } from "../network/DeviceStatus";
import { SensorCard } from "./SensorCard";
import { useToast } from "@/hooks/use-toast";
import { ExportButtons } from "./ExportButtons";

export default function SensorsPanel() {
  const [selectedCity, setSelectedCity] = useState("gdansk");
  const { toast } = useToast();
  
  const cities = Object.keys(sensorsData || {}).map(city => 
    sensorsData[city]?.name || city
  );

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
          </TabsList>
          <TabsContent value="data" className="sensors-panel">
            <CitySelector 
              cities={cities}
              selectedCity={selectedCity}
              onCitySelect={setSelectedCity}
            />
            <div className="mb-4">
              <ExportButtons containerClassName={selectedCity} />
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
        </Tabs>
      </Card>
    </div>
  );
}
