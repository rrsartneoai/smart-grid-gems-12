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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Mapa jakości powietrza - województwo pomorskie</h2>
      {cities.map((city) => (
        <Card key={city.name} className="p-4">
          <h3 className="text-xl font-semibold mb-4">{city.name}</h3>
          <div className="w-full aspect-video">
            <iframe
              src={city.url}
              className="w-full h-full border-0 rounded-lg"
              title={`Mapa jakości powietrza - ${city.name}`}
              allowFullScreen
            />
          </div>
        </Card>
      ))}
    </div>
  );
}