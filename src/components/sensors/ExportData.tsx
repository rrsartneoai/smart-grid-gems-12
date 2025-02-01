import { Button } from "@/components/ui/button";
import { FileText, Image, FileJson } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface ExportDataProps {
  onExport: () => void;
}

export const ExportData = ({ onExport }: ExportDataProps) => {
  const handleExportPDF = async () => {
    const element = document.getElementById('sensors-panel');
    if (!element) return;
    
    const canvas = await html2canvas(element);
    const pdf = new jsPDF();
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
    pdf.save('sensors-data.pdf');
  };

  const handleExportJPG = async () => {
    const element = document.getElementById('sensors-panel');
    if (!element) return;
    
    const canvas = await html2canvas(element);
    const link = document.createElement('a');
    link.download = 'sensors-data.jpg';
    link.href = canvas.toDataURL('image/jpeg');
    link.click();
  };

  const handleExportTXT = () => {
    const element = document.getElementById('sensors-panel');
    if (!element) return;
    
    const text = element.innerText;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'sensors-data.txt';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-2 p-4">
      <Button onClick={handleExportPDF} variant="outline" className="flex items-center gap-2">
        <FileText className="w-4 h-4" />
        Eksportuj do PDF
      </Button>
      <Button onClick={handleExportJPG} variant="outline" className="flex items-center gap-2">
        <Image className="w-4 h-4" />
        Eksportuj do JPG
      </Button>
      <Button onClick={handleExportTXT} variant="outline" className="flex items-center gap-2">
        <FileJson className="w-4 h-4" />
        Eksportuj do TXT
      </Button>
    </div>
  );
};