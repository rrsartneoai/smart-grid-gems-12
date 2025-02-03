import { useQuery } from "@tanstack/react-query";

interface AirQualityData {
  pm25: number;
  pm10: number;
  no2: number;
  so2: number;
  o3: number;
  co: number;
  temp: number;
  timestamp: string;
  city: string;
  quality: string;
  pm25_trend?: string;
  pm10_trend?: string;
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
    throw new Error('Brak klucza API Airly. Proszę skonfigurować klucz w ustawieniach.');
  }

  try {
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
        localStorage.removeItem('AIRLY_API_KEY');
        throw new Error('Nieprawidłowy klucz API Airly. Sprawdź swój klucz w ustawieniach.');
      }
      throw new Error('Błąd podczas pobierania danych o jakości powietrza');
    }

    const data = await response.json();
    
    // Calculate air quality based on PM2.5 and PM10 values
    const pm25Value = data.current.values.find((v: any) => v.name === 'PM25')?.value || 0;
    const pm10Value = data.current.values.find((v: any) => v.name === 'PM10')?.value || 0;
    
    let quality = "Dobra";
    if (pm25Value > 25 || pm10Value > 50) {
      quality = "Umiarkowana";
    }
    if (pm25Value > 50 || pm10Value > 100) {
      quality = "Zła";
    }

    // Get temperature and ensure it's in a reasonable range
    let temp = data.current.values.find((v: any) => v.name === 'TEMPERATURE')?.value;
    if (temp === undefined) {
      temp = 20; // Default temperature if not available
    } else if (temp > 50 || temp < -50) {
      // If temperature is outside reasonable range, assume it needs to be adjusted
      temp = temp / 10;
    }

    return {
      pm25: pm25Value,
      pm10: pm10Value,
      no2: data.current.values.find((v: any) => v.name === 'NO2')?.value || 0,
      so2: data.current.values.find((v: any) => v.name === 'SO2')?.value || 0,
      o3: data.current.values.find((v: any) => v.name === 'O3')?.value || 0,
      co: data.current.values.find((v: any) => v.name === 'CO')?.value || 0,
      temp: parseFloat(temp.toFixed(1)),
      timestamp: data.current.fromDateTime,
      city: city.name,
      quality: quality,
      pm25_trend: "Stabilny",
      pm10_trend: "Stabilny"
    };
  } catch (error) {
    console.error('Error fetching air quality data:', error);
    throw error;
  }
};

export const useAirQualityData = () => {
  return useQuery({
    queryKey: ['airQuality'],
    queryFn: async () => {
      const promises = cities.map(city => fetchAirQualityData(city));
      return Promise.all(promises);
    },
    retry: 1,
    refetchInterval: 300000, // Refresh every 5 minutes
    staleTime: 240000 // Consider data stale after 4 minutes
  });
};