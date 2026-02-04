import { CheckCircle, AlertTriangle, TrendingDown, CloudSun, Lightbulb, Loader2 } from "lucide-react";
import { Card } from "@/app/components/ui/card";

interface PredictionResult {
  disease: string;
  confidence: number;
  isHealthy: boolean;
  cropLoss: number;
  temperature: number;
  humidity: number;
  recommendation: string;
  imageUrl?: string;
}

interface ResultScreenProps {
  result: PredictionResult;
  isLoading?: boolean;
}

export function ResultScreen({ result, isLoading = false }: ResultScreenProps) {
  const statusColor = result.isHealthy ? "bg-[#22c55e]" : "bg-[#ef4444]";
  const statusTextColor = result.isHealthy ? "text-[#22c55e]" : "text-[#ef4444]";
  const statusBgColor = result.isHealthy ? "bg-green-50" : "bg-red-50";
  const statusBorderColor = result.isHealthy ? "border-[#22c55e]/30" : "border-[#ef4444]/30";

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-[26px] font-semibold text-foreground mb-2">Analyzing Image</h2>
          <p className="text-[16px] text-muted-foreground">Please wait...</p>
        </div>

        {/* Captured Image */}
        {result.imageUrl && (
          <Card className="p-4 shadow-md overflow-hidden">
            <img 
              src={result.imageUrl} 
              alt="Captured leaf" 
              className="w-full h-64 object-cover rounded-xl"
            />
          </Card>
        )}

        {/* Loading Card */}
        <Card className="p-12 shadow-lg border-2 border-primary/30 bg-primary/5">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
            <h3 className="text-[24px] font-bold text-primary mb-2">
              Processing Image...
            </h3>
            <p className="text-[16px] text-muted-foreground">
              Our AI is analyzing the leaf for disease detection
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-[26px] font-semibold text-foreground mb-2">Detection Result</h2>
        <p className="text-[16px] text-muted-foreground">Analysis complete</p>
      </div>

      {/* Captured Image */}
      {result.imageUrl && (
        <Card className="p-4 shadow-md overflow-hidden">
          <img 
            src={result.imageUrl} 
            alt="Captured leaf" 
            className="w-full h-64 object-cover rounded-xl"
          />
        </Card>
      )}

      {/* Main Result Card */}
      <Card className={`p-8 shadow-lg border-2 ${statusBorderColor} ${statusBgColor}`}>
        <div className="flex flex-col items-center text-center">
          <div className={`w-20 h-20 ${statusColor} rounded-full flex items-center justify-center mb-4`}>
            {result.isHealthy ? (
              <CheckCircle className="w-12 h-12 text-white" />
            ) : (
              <AlertTriangle className="w-12 h-12 text-white" />
            )}
          </div>
          
          <h3 className={`text-[30px] font-bold mb-3 ${statusTextColor}`}>
            {result.disease}
          </h3>
          
          <div className="w-full bg-white/70 rounded-2xl p-4 mt-2">
            <p className="text-[16px] text-muted-foreground mb-2">Confidence Level</p>
            <div className="flex items-center justify-center gap-3">
              <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className={`h-full ${statusColor} transition-all duration-500`}
                  style={{ width: `${result.confidence}%` }}
                ></div>
              </div>
              <span className={`text-[24px] font-bold ${statusTextColor}`}>
                {result.confidence}%
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Crop Loss Card */}
      {!result.isHealthy && (
        <Card className="p-6 shadow-md">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center shrink-0">
              <TrendingDown className="w-8 h-8 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-[20px] font-semibold text-foreground mb-2">
                Estimated Crop Loss
              </h3>
              <p className="text-[32px] font-bold text-orange-600">{result.cropLoss}%</p>
              <p className="text-[14px] text-muted-foreground mt-2">
                Based on disease severity and current spread
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Environmental Conditions */}
      <Card className="p-6 shadow-md">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
            <CloudSun className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-[20px] font-semibold text-foreground mb-4">
              Environmental Conditions
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-xl p-4">
                <p className="text-[14px] text-muted-foreground mb-1">Temperature</p>
                <p className="text-[22px] font-bold text-foreground">{result.temperature}°C</p>
              </div>
              <div className="bg-muted/50 rounded-xl p-4">
                <p className="text-[14px] text-muted-foreground mb-1">Humidity</p>
                <p className="text-[22px] font-bold text-foreground">{result.humidity}%</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Recommendation Card */}
      <Card className="p-6 shadow-md bg-primary/5 border-primary/30">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center shrink-0">
            <Lightbulb className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-[20px] font-semibold text-foreground mb-3">
              Recommended Temporary Action
            </h3>
            <p className="text-[17px] text-foreground leading-relaxed whitespace-pre-line">
              {result.recommendation}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}