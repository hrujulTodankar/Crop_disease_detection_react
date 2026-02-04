import { Thermometer, Droplets, Sprout, Cpu } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Progress } from "@/app/components/ui/progress";

interface SensorData {
  temperature: number;
  humidity: number;
  soilMoisture: number;
}

interface SensorScreenProps {
  sensorData: SensorData;
}

export function SensorScreen({ sensorData }: SensorScreenProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-[26px] font-semibold text-foreground mb-2">Sensor Data</h2>
        <p className="text-[16px] text-muted-foreground">Live environmental monitoring</p>
      </div>

      {/* Temperature Card */}
      <Card className="p-6 shadow-md">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
            <Thermometer className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-baseline justify-between mb-3">
              <h3 className="text-[20px] font-semibold text-foreground">Temperature</h3>
              <span className="text-[28px] font-bold text-primary">{sensorData.temperature}°C</span>
            </div>
            <Progress value={(sensorData.temperature / 50) * 100} className="h-3" />
            <p className="text-[14px] text-muted-foreground mt-2">Optimal range: 20-30°C</p>
          </div>
        </div>
      </Card>

      {/* Humidity Card */}
      <Card className="p-6 shadow-md">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
            <Droplets className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-baseline justify-between mb-3">
              <h3 className="text-[20px] font-semibold text-foreground">Humidity</h3>
              <span className="text-[28px] font-bold text-primary">{sensorData.humidity}%</span>
            </div>
            <Progress value={sensorData.humidity} className="h-3" />
            <p className="text-[14px] text-muted-foreground mt-2">Optimal range: 60-80%</p>
          </div>
        </div>
      </Card>

      {/* Soil Moisture Card */}
      <Card className="p-6 shadow-md">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
            <Sprout className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-baseline justify-between mb-3">
              <h3 className="text-[20px] font-semibold text-foreground">Soil Moisture</h3>
              <span className="text-[28px] font-bold text-primary">{sensorData.soilMoisture}%</span>
            </div>
            <Progress value={sensorData.soilMoisture} className="h-3" />
            <p className="text-[14px] text-muted-foreground mt-2">Optimal range: 40-60%</p>
          </div>
        </div>
      </Card>

      {/* Device Info */}
      <Card className="p-5 shadow-md bg-secondary/30 border-secondary">
        <div className="flex items-center gap-3">
          <Cpu className="w-6 h-6 text-primary" />
          <div>
            <p className="text-[16px] font-medium text-secondary-foreground">
              Data received from ESP32 IoT device
            </p>
            <p className="text-[14px] text-muted-foreground mt-1">
              Last updated: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
