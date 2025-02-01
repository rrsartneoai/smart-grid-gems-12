import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const AirQualityMap = () => {
  const { t } = useTranslation();
  const [selectedCity, setSelectedCity] = useState("gdansk");

  const cities = {
    gdansk: "https://aqicn.org/map/poland/pomorskie/gdansk/gdansk-powstancow/pl/",
    gdynia: "https://aqicn.org/map/poland/pomorskie/gdynia/gdynia-szkolna/pl/",
    sopot: "https://aqicn.org/map/poland/pomorskie/sopot/sopot-bitwy/pl/",
    slupsk: "https://aqicn.org/map/poland/pomorskie/slupsk/slupsk-kniaziewicza/pl/",
    ustka: "https://aqicn.org/map/poland/pomorskie/ustka/ustka-zulawy/pl/"
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          {t('airQualityMap')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedCity} onValueChange={setSelectedCity} className="w-full">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="gdansk">Gdańsk</TabsTrigger>
            <TabsTrigger value="gdynia">Gdynia</TabsTrigger>
            <TabsTrigger value="sopot">Sopot</TabsTrigger>
            <TabsTrigger value="slupsk">Słupsk</TabsTrigger>
            <TabsTrigger value="ustka">Ustka</TabsTrigger>
          </TabsList>
          {Object.entries(cities).map(([city, url]) => (
            <TabsContent key={city} value={city}>
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                <iframe
                  src={url}
                  className="w-full h-full border-0"
                  title={`${t('airQualityMap')} - ${city}`}
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};