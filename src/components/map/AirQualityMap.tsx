import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

export const AirQualityMap = () => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          {t('airQualityMap')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-video rounded-lg overflow-hidden bg-muted">
          <iframe
            src="https://aqicn.org/map/poland/pl/"
            className="w-full h-full border-0"
            title={t('airQualityMap')}
          />
        </div>
      </CardContent>
    </Card>
  );
};