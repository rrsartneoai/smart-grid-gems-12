import { GoogleGenerativeAI } from "@google/generative-ai";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { getGeminiResponse } from '@/lib/gemini';
import { calculateTFIDF } from './searchUtils';
import { toast } from "@/components/ui/use-toast";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY || "");

let documentChunks: { text: string; metadata?: Record<string, any> }[] = [];

export const generateRAGResponse = async (query: string): Promise<string> => {
  try {
    console.log('Generuję odpowiedź dla zapytania:', query);

    if (documentChunks.length === 0) {
      console.log('Brak dokumentów w pamięci');
      return "Nie wgrano jeszcze żadnego dokumentu. Proszę najpierw wgrać dokument, aby móc zadawać pytania.";
    }

    const relevantChunks = searchRelevantChunks(query);
    
    if (relevantChunks.length === 0) {
      console.log('Nie znaleziono pasujących fragmentów');
      return "Nie znalazłem odpowiednich informacji w wgranym dokumencie, które pomogłyby odpowiedzieć na to pytanie.";
    }

    const context = relevantChunks.join('\n\n');
    const prompt = `Na podstawie poniższego kontekstu, odpowiedz na pytanie. Jeśli odpowiedź nie znajduje się w kontekście, powiedz o tym.

Kontekst:
${context}

Pytanie: ${query}

Odpowiedz w języku polskim, używając pełnych zdań.`;

    console.log('Wysyłam zapytanie do Gemini z kontekstem długości:', context.length);
    const response = await getGeminiResponse(prompt);
    
    if (!response) {
      throw new Error("Nie otrzymano odpowiedzi od modelu");
    }
    
    return response;
  } catch (error) {
    console.error('Błąd podczas generowania odpowiedzi:', error);
    toast({
      title: "Błąd",
      description: "Nie udało się wygenerować odpowiedzi. Spróbuj ponownie.",
      variant: "destructive",
    });
    throw error;
  }
};

export const searchRelevantChunks = (query: string): string[] => {
  try {
    console.log('Szukam fragmentów dla zapytania:', query);
    
    if (documentChunks.length === 0) {
      console.log("Brak przetworzonych dokumentów w pamięci");
      return [];
    }

    const results = calculateTFIDF(
      query,
      documentChunks.map(chunk => chunk.text)
    );

    return results.slice(0, 3).map(result => result.text);
  } catch (error) {
    console.error('Błąd podczas wyszukiwania fragmentów:', error);
    return [];
  }
};

export const processDocumentForRAG = async (text: string) => {
  try {
    console.log('Rozpoczynam przetwarzanie dokumentu dla RAG, długość tekstu:', text.length);

    if (!text || text.trim().length === 0) {
      throw new Error("Dokument jest pusty");
    }

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const chunks = await splitter.createDocuments([text]);
    documentChunks = chunks.map(chunk => ({
      text: chunk.pageContent,
      metadata: chunk.metadata,
    }));

    console.log(`Dokument przetworzony na ${documentChunks.length} fragmentów`);

    const mainTopics = await extractMainTopics(text);

    return {
      message: `Dokument został przetworzony na ${documentChunks.length} fragmentów`,
      chunks: documentChunks,
      topics: mainTopics
    };
  } catch (error) {
    console.error("Błąd podczas przetwarzania dokumentu:", error);
    toast({
      title: "Błąd",
      description: "Wystąpił błąd podczas przetwarzania dokumentu. Spróbuj ponownie.",
      variant: "destructive",
    });
    throw error;
  }
};

async function extractMainTopics(text: string): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
      Przeanalizuj poniższy tekst i wypisz 5 najważniejszych zagadnień lub tematów z tego dokumentu:
      ${text}
      
      Odpowiedź sformatuj jako prostą listę 5 najważniejszych zagadnień, po jednym w linii.
      Zwróć TYLKO te 5 zagadnień, nic więcej.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const topicsString = response.text();
    return topicsString.split('\n').filter(line => line.trim() !== '').map(line => line.replace(/^\d+\.\s*/, '').trim());
  } catch (error) {
    console.error('Error extracting topics:', error);
    toast({
      title: "Błąd",
      description: "Nie udało się przetworzyć tematów dokumentu.",
      variant: "destructive",
    });
    throw error;
  }
}