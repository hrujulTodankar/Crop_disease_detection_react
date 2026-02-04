import { useEffect, useState } from "react";
import { CheckCircle2, Sparkles, Rocket } from "lucide-react";
import { Card } from "@/app/components/ui/card";

interface SuccessAnimationProps {
  onClose: () => void;
}

export function SuccessAnimation({ onClose }: SuccessAnimationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Auto-close after 4 seconds
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      style={{
        animation: visible ? "fadeIn 0.3s ease-in" : "fadeOut 0.3s ease-out"
      }}
    >
      <Card className="w-full max-w-sm shadow-2xl bg-white overflow-hidden">
        <div className="relative p-8 space-y-6">
          {/* Animated Background Sparkles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <Sparkles
                key={i}
                className="absolute text-primary/20"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 20 + 10}px`,
                  height: `${Math.random() * 20 + 10}px`,
                  animation: `float ${Math.random() * 3 + 2}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>

          {/* Success Icon */}
          <div className="flex justify-center relative z-10">
            <div 
              className="w-24 h-24 bg-primary rounded-full flex items-center justify-center"
              style={{
                animation: "scaleIn 0.5s ease-out, pulse 2s ease-in-out infinite"
              }}
            >
              <CheckCircle2 className="w-14 h-14 text-white" />
            </div>
          </div>

          {/* Success Message */}
          <div className="text-center space-y-3 relative z-10">
            <h2 
              className="text-[24px] font-bold text-foreground"
              style={{ animation: "slideUp 0.5s ease-out 0.2s backwards" }}
            >
              You're All Set! 🎉
            </h2>
            <p 
              className="text-[16px] text-muted-foreground"
              style={{ animation: "slideUp 0.5s ease-out 0.3s backwards" }}
            >
              Your app is now connected to Hugging Face
            </p>
          </div>

          {/* Features List */}
          <div 
            className="space-y-3 relative z-10"
            style={{ animation: "slideUp 0.5s ease-out 0.4s backwards" }}
          >
            <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[14px] font-medium">Real AI Predictions</p>
                <p className="text-[12px] text-muted-foreground">
                  Powered by your TensorFlow model
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[14px] font-medium">Automatic Fallback</p>
                <p className="text-[12px] text-muted-foreground">
                  Graceful error handling built-in
                </p>
              </div>
            </div>
          </div>

          {/* Next Step */}
          <div 
            className="text-center text-[14px] text-primary font-medium relative z-10"
            style={{ animation: "slideUp 0.5s ease-out 0.5s backwards" }}
          >
            Upload an image to test your connection!
          </div>
        </div>
      </Card>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        @keyframes scaleIn {
          from { 
            transform: scale(0);
            opacity: 0;
          }
          to { 
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%, 100% { 
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(var(--primary), 0.4);
          }
          50% { 
            transform: scale(1.05);
            box-shadow: 0 0 0 20px rgba(var(--primary), 0);
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
