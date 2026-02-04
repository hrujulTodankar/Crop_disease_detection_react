import { AlertCircle, Settings } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { getHuggingFaceConfig } from "@/app/services/huggingface";
import { useEffect, useState } from "react";

interface ConfigBannerProps {
  onOpenSettings: () => void;
}

export function ConfigBanner({ onOpenSettings }: ConfigBannerProps) {
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    const config = getHuggingFaceConfig();
    setIsConfigured(!!config);
  }, []);

  if (isConfigured) return null;

  return (
    <Card className="p-4 shadow-md bg-yellow-50 border-yellow-200">
      <div className="flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-yellow-800">
            Configure Hugging Face for real AI predictions
          </p>
          <p className="text-xs text-yellow-700 mt-1">
            Currently using mock predictions
          </p>
        </div>
        <Button
          onClick={onOpenSettings}
          size="sm"
          variant="outline"
          className="border-yellow-300 text-yellow-800 hover:bg-yellow-100"
        >
          <Settings className="w-4 h-4 mr-1" />
          Setup
        </Button>
      </div>
    </Card>
  );
}