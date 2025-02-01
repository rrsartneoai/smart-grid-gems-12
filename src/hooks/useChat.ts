import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { useAirQualityData } from "@/services/airQualityService";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  dataVisualizations?: Array<{
    type: "consumption" | "production" | "efficiency";
    title: string;
  }>;
}

const formatAirQualityResponse = (data: any[], query: string) => {
  const lowercaseQuery = query.toLowerCase();
  
  if (lowercaseQuery.includes("pm2.5") || lowercaseQuery.includes("pm10")) {
    return data.map(city => 
      `${city.city}:\nPM2.5: ${city.pm25} µg/m³\nPM10: ${city.pm10} µg/m³`
    ).join('\n\n');
  }
  
  if (lowercaseQuery.includes("rakotwórcz") || lowercaseQuery.includes("substancj")) {
    return data.map(city => 
      `${city.city}:\nNO₂: ${city.no2} µg/m³\nSO₂: ${city.so2} µg/m³\nO₃: ${city.o3} µg/m³\nCO: ${city.co} µg/m³`
    ).join('\n\n');
  }
  
  if (lowercaseQuery.includes("trend") || lowercaseQuery.includes("analiz")) {
    return "Analiza trendu zostanie przedstawiona na wykresie poniżej...";
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

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async (input: string) => {
      if (!airQualityData) {
        throw new Error("Brak danych o jakości powietrza");
      }
      return formatAirQualityResponse(airQualityData, input);
    },
    onSuccess: (response) => {
      const newMessage = {
        role: "assistant" as const,
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMessage]);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Błąd",
        description: "Nie udało się uzyskać odpowiedzi. Spróbuj ponownie.",
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

  return {
    messages,
    input,
    setInput,
    handleSubmit,
    isPending,
    clearConversation
  };
};