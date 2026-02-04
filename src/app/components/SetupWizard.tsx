import { X, ExternalLink } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";

interface SetupWizardProps {
  onClose: () => void;
  onOpenSettings: () => void;
}

export function SetupWizard({ onClose, onOpenSettings }: SetupWizardProps) {
  const handleSetupClick = () => {
    onClose();
    onOpenSettings();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md p-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Setup Wizard</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            Get real AI predictions by connecting to Hugging Face in just 3 steps:
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <span className="text-sm">Create free Hugging Face account</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <span className="text-sm">Get your API token</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <span className="text-sm">Configure in settings</span>
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button
              onClick={() => window.open('https://huggingface.co/join', '_blank')}
              variant="outline"
              className="flex-1"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Sign Up
            </Button>
            <Button onClick={handleSetupClick} className="flex-1">
              Configure
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}