interface EnergyCardProps {
  city: string;
}

export const EnergyCard: React.FC<EnergyCardProps> = ({ city }) => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Zużycie energii</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Aktualne zużycie</span>
          <span className="font-medium">2.4 kWh</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Dzienne zużycie</span>
          <span className="font-medium">45.2 kWh</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Miesięczne zużycie</span>
          <span className="font-medium">1,356 kWh</span>
        </div>
        <div className="h-[120px] w-full bg-muted rounded-md flex items-center justify-center">
          <span className="text-sm text-muted-foreground">Wykres zużycia</span>
        </div>
      </div>
    </div>
  );
};