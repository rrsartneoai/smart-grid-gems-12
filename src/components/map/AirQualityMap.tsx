import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

const cities = [
  {
    name: "Gdańsk",
    url: "https://airly.org/map/pl/#54.352,18.6466,11"
  },
  {
    name: "Gdynia",
    url: "https://airly.org/map/pl/#54.5189,18.5305,11"
  },
  {
    name: "Sopot",
    url: "https://airly.org/map/pl/#54.4418,18.5601,11"
  },
  {
    name: "Słupsk",
    url: "https://airly.org/map/pl/#54.4641,17.0285,11"
  },
  {
    name: "Ustka",
    url: "https://airly.org/map/pl/#54.5805,16.8614,11"
  }
];

export function AirQualityMap() {
  return (
    <Card className="p-4">
      <h2 className="text-2xl font-bold mb-4">Mapa jakości powietrza - województwo pomorskie</h2>
      <Tabs defaultValue="gdansk" className="w-full">
        <TabsList className="w-full justify-start">
          {cities.map((city) => (
            <TabsTrigger key={city.name.toLowerCase()} value={city.name.toLowerCase()}>
              {city.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {cities.map((city) => (
          <TabsContent key={city.name.toLowerCase()} value={city.name.toLowerCase()}>
            <div className="w-full aspect-video">
              <iframe
                src={city.url}
                className="w-full h-full border-0"
                title={`Mapa jakości powietrza - ${city.name}`}
                allowFullScreen
              />
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
}