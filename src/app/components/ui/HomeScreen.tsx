import { Camera, Leaf, Wifi, AlertCircle, Rocket } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { useRef, useState, useEffect } from "react";
import { getHuggingFaceConfig } from "@/app/services/huggingface";
import { ConfigBanner } from "@/app/components/ConfigBanner";
import { SetupWizard } from "@/app/components/SetupWizard";

interface HomeScreenProps {
  selectedCrop: string;
  onCropChange: (crop: string) => void;
  onCapture: (file: File) => void;
  onOpenSettings?: () => void;
}

export function HomeScreen({ selectedCrop, onCropChange, onCapture, onOpenSettings }: HomeScreenProps) {
  const crops = ["Tomato"];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isConfigured, setIsConfigured] = useState(false);
  const [showSetupWizard, setShowSetupWizard] = useState(false);

  // Check if Hugging Face is configured
  const checkConfiguration = () => {
    const config = getHuggingFaceConfig();
    setIsConfigured(!!config);
  };

  useEffect(() => {
    checkConfiguration();
  }, []);

  // Re-check when returning to this screen or after settings change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkConfiguration();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onCapture(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
          <Leaf className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-[28px] font-semibold text-foreground">Crop Disease Detection</h1>
      </div>

      {/* Configuration Banner */}
      {onOpenSettings && <ConfigBanner onOpenSettings={onOpenSettings} />}

      {/* Crop Selection Card */}
      <Card className="p-6 shadow-md">
        <label className="block text-[18px] mb-3 text-foreground">Select Crop Type</label>
        <select
          value={selectedCrop}
          onChange={(e) => onCropChange(e.target.value)}
          className="w-full p-4 text-[18px] rounded-xl border-2 border-primary/30 bg-input-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          {crops.map((crop) => (
            <option key={crop} value={crop}>
              {crop}
            </option>
          ))}
        </select>
      </Card>

      {/* Capture Button Card */}
      <Card className="p-8 shadow-md">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={handleButtonClick}
          className="w-full bg-primary hover:bg-primary/90 text-white rounded-2xl p-8 flex flex-col items-center gap-4 transition-all active:scale-95"
        >
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
            <Camera className="w-12 h-12" />
          </div>
          <span className="text-[22px] font-semibold">Capture / Upload Leaf Image</span>
        </button>
        
        <p className="text-center text-[16px] text-muted-foreground mt-6 leading-relaxed">
          Capture a clear image of the leaf under good lighting
        </p>
      </Card>

      {/* Setup Wizard Button - Only show if not configured */}
      {!isConfigured && onOpenSettings && (
        <Card className="p-6 shadow-md bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Rocket className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-[18px] font-semibold">Ready for Real AI?</h3>
              <p className="text-[14px] text-muted-foreground">Setup takes only 3 minutes</p>
            </div>
          </div>
          <Button
            onClick={() => setShowSetupWizard(true)}
            className="w-full h-12 text-[16px] font-semibold"
          >
            <Rocket className="w-5 h-5 mr-2" />
            Start Setup Wizard
          </Button>
        </Card>
      )}

      {/* Status Indicator */}
      <Card className={`p-5 shadow-md ${isConfigured ? 'bg-secondary/30 border-secondary' : 'bg-yellow-50 border-yellow-200'}`}>
        <div className="flex items-center justify-center gap-3">
          <div className="relative">
            {isConfigured ? (
              <>
                <Wifi className="w-6 h-6 text-primary" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              </>
            ) : (
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            )}
          </div>
          <span className={`text-[17px] font-medium ${isConfigured ? 'text-secondary-foreground' : 'text-yellow-800'}`}>
            {isConfigured ? 'Connected to Hugging Face' : 'Using Mock Predictions'}
          </span>
        </div>
        {!isConfigured && (
          <p className="text-center text-[14px] text-yellow-700 mt-2">
            Configure Hugging Face in settings for real AI predictions
          </p>
        )}
      </Card>

      {/* Setup Wizard Modal */}
      {showSetupWizard && onOpenSettings && (
        <SetupWizard
          onClose={() => {
            setShowSetupWizard(false);
            // Re-check configuration when wizard closes
            checkConfiguration();
          }}
          onOpenSettings={onOpenSettings}
        />
      )}
    </div>
  );
}