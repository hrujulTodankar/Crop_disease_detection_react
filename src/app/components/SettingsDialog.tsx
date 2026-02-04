import { useState, useEffect } from "react";
import { X, Save, ExternalLink } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { getHuggingFaceConfig, setHuggingFaceConfig } from "@/app/services/huggingface";

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSuccess?: () => void;
}

export function SettingsDialog({ isOpen, onClose, onConfigSuccess }: SettingsDialogProps) {
  const [apiKey, setApiKey] = useState("");
  const [modelId, setModelId] = useState("nateraw/food");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const config = getHuggingFaceConfig();
      if (config) {
        setApiKey(config.apiKey);
        setModelId(config.modelId);
      }
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (!apiKey.trim()) return;
    
    setIsSaving(true);
    try {
      setHuggingFaceConfig({
        apiKey: apiKey.trim(),
        modelId: modelId.trim() || "nateraw/food"
      });
      
      onConfigSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to save config:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md p-6 bg-white">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Hugging Face Settings</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">API Token</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="hf_..."
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-gray-500 mt-1">
              Get your token from{" "}
              <button
                onClick={() => window.open('https://huggingface.co/settings/tokens', '_blank')}
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                Hugging Face <ExternalLink className="w-3 h-3" />
              </button>
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Model ID</label>
            <input
              type="text"
              value={modelId}
              onChange={(e) => setModelId(e.target.value)}
              placeholder="nateraw/food"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-gray-500 mt-1">
              Default model for plant disease detection
            </p>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={!apiKey.trim() || isSaving}
              className="flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}