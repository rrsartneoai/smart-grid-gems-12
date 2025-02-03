import { Button } from "@/components/ui/button";
import { FileText, Trash2 } from "lucide-react";
import { Message } from "@/types/chat";

interface ChatHeaderProps {
  messages: Message[];
}

export const ChatHeader = ({ messages }: ChatHeaderProps) => {
  const handleExport = async (format: 'pdf' | 'txt') => {
    const content = messages
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join('\n\n');

    if (format === 'txt') {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'chat-export.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (format === 'pdf') {
      // PDF export functionality would go here
      console.log('PDF export not implemented yet');
    }
  };

  return (
    <div className="flex items-center justify-between border-b px-4 py-2">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">Asystent AI</h2>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleExport('pdf')}
          title="Eksportuj do PDF"
        >
          <FileText className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleExport('txt')}
          title="Eksportuj do TXT"
        >
          <FileText className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};