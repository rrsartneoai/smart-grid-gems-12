import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SensorsData } from "./SensorsData";
import { DataComparison } from "./DataComparison";
import { AlertsConfig } from "./AlertsConfig";
import { ExportData } from "./ExportData";
import { CitySelector } from "./CitySelector";
import { DeviceStatus } from "../network/DeviceStatus";
import * as XLSX from 'xlsx';

export default function SensorsPanel() {
  const [data, setData] = useState([]); // Example state for sensor data

  const handleExport = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "Sensors Data");
    XLSX.writeFile(wb, "sensors-data.xlsx");
  };

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
          <TabsContent value="data">
            <CitySelector />
            <SensorsData />
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
