import { useQuery } from "@tanstack/react-query";

interface AirQualityData {
  pm25: number;
  pm10: number;
  no2: number;
  so2: number;
  o3: number;
  co: number;
  timestamp: string;
  city: string;
}

const cities = [
  { name: "Gdańsk", lat: 54.352, lon: 18.6466 },
  { name: "Gdynia", lat: 54.5189, lon: 18.5305 },
  { name: "Sopot", lat: 54.4418, lon: 18.5601 },
  { name: "Słupsk", lat: 54.4641, lon: 17.0285 },
  { name: "Ustka", lat: 54.5805, lon: 16.8614 }
];

export const fetchAirQualityData = async (city: { lat: number; lon: number; name: string }): Promise<AirQualityData> => {
  const apiKey = localStorage.getItem('AIRLY_API_KEY');
  
  if (!apiKey) {
    throw new Error('Airly API key not found. Please set your API key in the settings.');
  }

  const response = await fetch(
    `https://airapi.airly.eu/v2/measurements/point?lat=${city.lat}&lng=${city.lon}`,
    {
      headers: {
        'Accept': 'application/json',
        'apikey': apiKey
      }
    }
  );

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('AIRLY_API_KEY'); // Clear invalid key
      throw new Error('Invalid Airly API key. Please check your API key in the settings.');
    }
    throw new Error('Failed to fetch air quality data');
  }

  const data = await response.json();
  return {
    pm25: data.current.values.find((v: any) => v.name === 'PM25')?.value || 0,
    pm10: data.current.values.find((v: any) => v.name === 'PM10')?.value || 0,
    no2: data.current.values.find((v: any) => v.name === 'NO2')?.value || 0,
    so2: data.current.values.find((v: any) => v.name === 'SO2')?.value || 0,
    o3: data.current.values.find((v: any) => v.name === 'O3')?.value || 0,
    co: data.current.values.find((v: any) => v.name === 'CO')?.value || 0,
    timestamp: data.current.fromDateTime,
    city: city.name
  };
};

export const useAirQualityData = () => {
  return useQuery({
    queryKey: ['airQuality'],
    queryFn: async () => {
      const promises = cities.map(city => fetchAirQualityData(city));
      return Promise.all(promises);
    },
    retry: false,
    refetchInterval: 300000 // Refresh every 5 minutes
  });
};