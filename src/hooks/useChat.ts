
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { useAirQualityData } from "@/services/airQualityService";
import { generateGeminiResponse } from "@/lib/gemini";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const formatAirQualityResponse = (data: any[], query: string) => {
  if (!data || data.length === 0) {
    return "Przepraszam, ale nie mogę uzyskać dostępu do danych o jakości powietrza w tym momencie.";
  }

  const lowercaseQuery = query.toLowerCase();
  
  if (lowercaseQuery.includes("jakość powietrza")) {
    return data.map(city => 
      `${city.city}: Jakość powietrza: ${city.quality}\nPM2.5: ${city.pm25} µg/m³\nPM10: ${city.pm10} µg/m³`
    ).join('\n\n');
  }
  
  if (lowercaseQuery.includes("pm2.5") || lowercaseQuery.includes("pm10")) {
    return data.map(city => 
      `${city.city}:\nPM2.5: ${city.pm25} µg/m³\nPM10: ${city.pm10} µg/m³`
    ).join('\n\n');
  }
  
  if (lowercaseQuery.includes("porównaj")) {
    return "Porównanie jakości powietrza między miastami:\n" + data.map(city => 
      `${city.city}:\nIndeks jakości: ${city.quality}\nPM2.5: ${city.pm25} µg/m³\nPM10: ${city.pm10} µg/m³`
    ).join('\n\n');
  }
  
  if (lowercaseQuery.includes("rakotwórcz") || lowercaseQuery.includes("substancj")) {
    return data.map(city => 
      `${city.city}:\nNO₂: ${city.no2} µg/m³\nSO₂: ${city.so2} µg/m³\nO₃: ${city.o3} µg/m³\nCO: ${city.co} µg/m³`
    ).join('\n\n');
  }
  
  if (lowercaseQuery.includes("trend") || lowercaseQuery.includes("analiz")) {
    return "Analiza trendu zanieczyszczeń:\n" + data.map(city => 
      `${city.city}:\nTrend PM2.5: ${city.pm25_trend}\nTrend PM10: ${city.pm10_trend}`
    ).join('\n\n');
  }
  
  return data.map(city => 
    `${city.city}:\nPM2.5: ${city.pm25} µg/m³\nPM10: ${city.pm10} µg/m³\nNO₂: ${city.no2} µg/m³`
  ).join('\n\n');
};

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Witaj! Jestem asystentem monitorowania jakości powietrza. Mogę pomóc Ci sprawdzić aktualne poziomy zanieczyszczeń, porównać dane między lokalizacjami lub przeanalizować trendy. W czym mogę Ci pomóc?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const { toast } = useToast();
  const { data: airQualityData } = useAirQualityData();

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async (input: string) => {
      try {
        // Check if we have air quality data to respond
        if (airQualityData) {
          return formatAirQualityResponse(airQualityData, input);
        }

        // Fallback to Gemini for general questions about navigation and information
        const geminiResponse = await generateGeminiResponse(`Odpowiedz profesjonalnie na temat jakości powietrza w województwie pomorskim lub nawigacji po aplikacji. Pytanie: ${input}`);
        return geminiResponse;
      } catch (error) {
        console.error("Error in chat:", error);
        throw new Error("Nie udało się uzyskać odpowiedzi. Spróbuj ponownie.");
      }
    },
    onSuccess: (response) => {
      const newMessage = {
        role: "assistant" as const,
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMessage]);
    },
    onError: (error) => {
      console.error("Error in chat:", error);
      toast({
        variant: "destructive",
        title: "Błąd",
        description: error.message || "Nie udało się uzyskać odpowiedzi. Spróbuj ponownie.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      role: "user" as const,
      content: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    sendMessage(input);
    setInput("");
  };

  const clearConversation = () => {
    setMessages([
      {
        role: "assistant",
        content: "Witaj! Jestem asystentem monitorowania jakości powietrza. Mogę pomóc Ci sprawdzić aktualne poziomy zanieczyszczeń, porównać dane między lokalizacjami lub przeanalizować trendy. W czym mogę Ci pomóc?",
        timestamp: new Date(),
      },
    ]);
    toast({
      title: "Konwersacja wyczyszczona",
      description: "Historia czatu została zresetowana.",
    });
  };

  return {
    messages,
    input,
    setInput,
    handleSubmit,
    isPending,
    clearConversation
  };
};
