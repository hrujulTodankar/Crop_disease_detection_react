import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { 
  ExternalLink, 
  Book, 
  Settings, 
  Rocket,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

interface QuickActionsCardProps {
  isConfigured: boolean;
  onOpenSettings?: () => void;
}

export function QuickActionsCard({ isConfigured, onOpenSettings }: QuickActionsCardProps) {
  return (
    <Card className="p-6 shadow-md bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isConfigured ? 'bg-primary' : 'bg-yellow-500'
          }`}>
            {isConfigured ? (
              <CheckCircle2 className="w-6 h-6 text-white" />
            ) : (
              <AlertCircle className="w-6 h-6 text-white" />
            )}
          </div>
          <div>
            <h3 className="text-[18px] font-semibold">
              {isConfigured ? 'You\'re All Set!' : 'Quick Setup'}
            </h3>
            <p className="text-[13px] text-muted-foreground">
              {isConfigured ? 'Using real AI predictions' : 'Get started in 3 minutes'}
            </p>
          </div>
        </div>

        {/* Status Info */}
        {isConfigured ? (
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-[14px] font-medium text-primary">
                  Hugging Face Connected
                </p>
                <p className="text-[12px] text-primary/80">
                  Your predictions are powered by your TensorFlow model
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Rocket className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-[14px] font-medium text-yellow-900">
                  Using Mock Predictions
                </p>
                <p className="text-[12px] text-yellow-800">
                  Configure Hugging Face to use your real AI model
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="space-y-2">
          <p className="text-[13px] font-medium text-muted-foreground">Quick Links</p>
          
          <div className="grid grid-cols-2 gap-2">
            {onOpenSettings && (
              <Button
                onClick={onOpenSettings}
                variant="outline"
                className="h-10 text-[13px]"
              >
                <Settings className="w-4 h-4 mr-1.5" />
                Settings
              </Button>
            )}
            
            <Button
              onClick={() => window.open("https://huggingface.co/settings/tokens", "_blank")}
              variant="outline"
              className="h-10 text-[13px]"
            >
              <ExternalLink className="w-4 h-4 mr-1.5" />
              Get Token
            </Button>
          </div>
        </div>

        {/* Tips */}
        {isConfigured && (
          <div className="text-[12px] text-muted-foreground space-y-1 pt-2 border-t">
            <p className="font-medium">💡 Pro Tips:</p>
            <ul className="list-disc list-inside space-y-0.5 ml-2">
              <li>First prediction may take 10-30 seconds</li>
              <li>Use clear, well-lit images for best results</li>
              <li>Check History tab to see past predictions</li>
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
}
