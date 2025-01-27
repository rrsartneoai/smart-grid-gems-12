interface ExportDataProps {
  onExport: () => void;
}

export const ExportData = ({ onExport }: ExportDataProps) => {
  return (
    <div className="p-4">
      <button 
        onClick={onExport}
        className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
      >
        Export Data
      </button>
    </div>
  );
};