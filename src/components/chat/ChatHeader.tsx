import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useChat } from "@/hooks/useChat";
import { toast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

export function ChatHeader() {
  const { messages } = useChat();

  const handleSaveAsPDF = async () => {
    const doc = new jsPDF();
    doc.setFont("helvetica");
    doc.setLanguage("pl");
    
    messages.forEach((message, index) => {
      const text = `${message.role === 'assistant' ? 'Asystent' : 'Użytkownik'}: ${message.content}`;
      const splitText = doc.splitTextToSize(text, 180);
      
      if (index === 0) {
        doc.text(splitText, 15, 20);
      } else {
        doc.addPage();
        doc.text(splitText, 15, 20);
      }
    });

    doc.save("rozmowa-asystent.pdf");
    
    toast({
      title: "Sukces",
      description: "Rozmowa została zapisana w formacie PDF",
    });
  };

  const handleSaveAsTXT = () => {
    const text = messages
      .map(message => `${message.role === 'assistant' ? 'Asystent' : 'Użytkownik'}: ${message.content}`)
      .join('\n\n');
    
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'rozmowa-asystent.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Sukces",
      description: "Rozmowa została zapisana w formacie TXT",
    });
  };

  return (
    <div className="flex justify-between items-center p-4 border-b">
      <h2 className="text-lg font-semibold">Czat</h2>
      <div className="flex space-x-2">
        <Button onClick={handleSaveAsPDF}>Eksportuj jako PDF</Button>
        <Button onClick={handleSaveAsTXT}>Eksportuj jako TXT</Button>
      </div>
    </div>
  );
}
