import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EnergyCard } from "./energy/EnergyCard";
import { BikeStationsCard } from "./bikes/BikeStationsCard";
import { ChargingStationsCard } from "./charging/ChargingStationsCard";

export function ExperimentsPanel() {
  const [selectedCity, setSelectedCity] = useState("gdansk");

  const cities = [
    { id: "gdansk", name: "Gdańsk" },
    { id: "gdynia", name: "Gdynia" },
    { id: "sopot", name: "Sopot" },
    { id: "slupsk", name: "Słupsk" },
    { id: "ustka", name: "Ustka" }
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Dane z Pomorskiego</h2>
        <div className="flex flex-wrap gap-2 mb-6">
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
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <EnergyCard city={selectedCity} />
          <BikeStationsCard city={selectedCity} />
          <ChargingStationsCard city={selectedCity} />
        </div>
      </Card>
    </div>
  );
}