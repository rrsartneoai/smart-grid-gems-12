import { WeatherPanel } from "@/components/weather/WeatherPanel";
import { AirQualityMap } from "@/components/map/AirQualityMap";

export const ExperimentsPanel = () => {
  return (
    <div className="space-y-6">
      <WeatherPanel />
      <AirQualityMap />
    </div>
  );
};