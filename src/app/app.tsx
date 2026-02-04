import { useState, useEffect } from "react";
import { Home, Activity, FileText, BarChart3, Settings } from "lucide-react";
import { HomeScreen } from "@/app/components/ui/HomeScreen";
import { SensorScreen } from "@/app/components/ui/SensorScreen";
import { ResultScreen } from "@/app/components/ui/ResultScreen";
import { HistoryScreen } from "@/app/components/ui/HistoryScreen";
import { SettingsDialog } from "@/app/components/SettingsDialog";
import { getHuggingFaceConfig, predictWithHuggingFace } from "@/app/services/huggingface";

type Screen = "home" | "sensor" | "result" | "history";

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

interface HistoryEntry {
  id: string;
  cropName: string;
  date: Date;
  disease: string;
  isHealthy: boolean;
}

// Helper function to load history from localStorage
function loadHistory(): HistoryEntry[] {
  try {
    const stored = localStorage.getItem('prediction_history');
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    // Convert date strings back to Date objects
    return parsed.map((entry: any) => ({
      ...entry,
      date: new Date(entry.date)
    }));
  } catch (error) {
    console.error('Failed to load history:', error);
    return [];
  }
}

// Helper function to save history to localStorage
function saveHistory(history: HistoryEntry[]) {
  try {
    localStorage.setItem('prediction_history', JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save history:', error);
  }
}

// Helper function to add new entry to history
function addToHistory(entry: Omit<HistoryEntry, 'id'>): HistoryEntry[] {
  const newEntry: HistoryEntry = {
    ...entry,
    id: Date.now().toString()
  };
  
  const currentHistory = loadHistory();
  const updatedHistory = [newEntry, ...currentHistory].slice(0, 50); // Keep last 50 entries
  saveHistory(updatedHistory);
  return updatedHistory;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [selectedCrop, setSelectedCrop] = useState("Tomato");
  const [capturedImageUrl, setCapturedImageUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [configRefreshKey, setConfigRefreshKey] = useState(0);
  
  // Real history from localStorage
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  
  // Load history on mount
  useEffect(() => {
    setHistory(loadHistory());
  }, []);
  
  // Mock sensor data
  const [sensorData] = useState({
    temperature: 28,
    humidity: 72,
    soilMoisture: 55,
  });

  // Initial prediction result
  const [predictionResult, setPredictionResult] = useState<PredictionResult>({
    disease: "Awaiting Analysis",
    confidence: 0,
    isHealthy: true,
    cropLoss: 0,
    temperature: 28,
    humidity: 72,
    recommendation: "Please capture an image to begin disease detection.",
  });

  const handleCapture = (file: File) => {
    // Create object URL for the captured image
    const imageUrl = URL.createObjectURL(file);
    setCapturedImageUrl(imageUrl);
    
    // Call the prediction API
    predictDisease(file, imageUrl);
  };

  const predictDisease = async (file: File, imageUrl: string) => {
    setIsLoading(true);
    setError("");
    
    // Navigate to result screen immediately to show loading state
    setCurrentScreen("result");
    
    try {
      // Check if Hugging Face is configured
      const hfConfig = getHuggingFaceConfig();
      
      if (hfConfig) {
        console.log("🤗 Using Hugging Face for predictions");
        
        // Use Hugging Face Inference API
        const predictions = await predictWithHuggingFace(file, hfConfig);
        
        // Process the top prediction
        const topPrediction = predictions[0];
        const diseaseName = topPrediction.label
          .replace(/_/g, " ")
          .replace(/\b\w/g, l => l.toUpperCase());
        
        const confidence = Math.round(topPrediction.score * 100);
        const isHealthy = topPrediction.label.toLowerCase().includes("healthy");
        const cropLoss = isHealthy ? 0 : Math.round((1 - topPrediction.score) * 30 + 15);
        
        const recommendation = getRecommendation(diseaseName, isHealthy);
        
        const result = {
          disease: diseaseName,
          confidence: confidence,
          isHealthy: isHealthy,
          cropLoss: cropLoss,
          temperature: sensorData.temperature,
          humidity: sensorData.humidity,
          recommendation: recommendation,
          imageUrl: imageUrl,
        };
        
        setPredictionResult(result);
        
        // Add to history
        const updatedHistory = addToHistory({
          cropName: selectedCrop,
          date: new Date(),
          disease: diseaseName,
          isHealthy: isHealthy
        });
        setHistory(updatedHistory);
        
        return;
      }
      
      console.warn("⚠️ Hugging Face not configured, using client-side mock predictions");
      // Fallback to client-side mock prediction
      await generateMockPrediction(imageUrl);
      
    } catch (err) {
      console.error("Prediction error:", err);
      setError(err instanceof Error ? err.message : "Failed to process prediction");
      
      // Fallback to client-side mock prediction
      await generateMockPrediction(imageUrl);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockPrediction = async (imageUrl: string) => {
    // Mock diseases only for tomato
    const mockDiseases = [
      { label: "tomato_early_blight", score: 0.92, healthy: false },
      { label: "tomato_healthy", score: 0.95, healthy: true },
      { label: "tomato_late_blight", score: 0.88, healthy: false },
      { label: "tomato_septoria_leaf_spot", score: 0.89, healthy: false },
      { label: "tomato_bacterial_spot", score: 0.87, healthy: false },
    ];

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Randomly select a mock disease
    const mockPrediction = mockDiseases[Math.floor(Math.random() * mockDiseases.length)];
    
    const diseaseName = mockPrediction.label.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
    const confidence = Math.round(mockPrediction.score * 100);
    const isHealthy = mockPrediction.healthy;
    const cropLoss = isHealthy ? 0 : Math.round((1 - mockPrediction.score) * 30 + 15);

    const recommendation = getRecommendation(diseaseName, isHealthy);

    const result = {
      disease: diseaseName,
      confidence: confidence,
      isHealthy: isHealthy,
      cropLoss: cropLoss,
      temperature: sensorData.temperature,
      humidity: sensorData.humidity,
      recommendation: `${recommendation}\n\n⚠️ Note: This is a mock prediction. Configure Hugging Face for real AI predictions.`,
      imageUrl: imageUrl,
    };
    
    setPredictionResult(result);
    
    // Add mock prediction to history
    const updatedHistory = addToHistory({
      cropName: selectedCrop,
      date: new Date(),
      disease: diseaseName,
      isHealthy: isHealthy
    });
    setHistory(updatedHistory);
  };

  // Get disease-specific recommendations
  const getRecommendation = (disease: string, isHealthy: boolean): string => {
    if (isHealthy) {
      return "Your crop appears healthy! Continue regular monitoring and maintain good agricultural practices. Ensure adequate watering, proper nutrition, and pest control.";
    }

    const recommendations: Record<string, string> = {
      "early blight": "Immediately remove and destroy infected leaves. Apply fungicide containing chlorothalonil or mancozeb. Ensure proper spacing between plants for air circulation. Avoid overhead watering to reduce leaf wetness.",
      "late blight": "Remove and destroy all infected plant parts immediately. Apply copper-based fungicide or mancozeb. Improve air circulation and avoid overhead irrigation. Consider resistant varieties for future planting.",
      "septoria leaf spot": "Remove infected leaves and destroy them. Apply fungicide with chlorothalonil. Mulch around plants to prevent soil splash. Rotate crops and avoid overhead watering.",
      "anthracnose": "Prune and destroy infected parts. Apply copper-based fungicide. Improve air circulation and reduce humidity. Avoid working with plants when wet.",
      "bacterial spot": "Remove infected leaves. Apply copper-based bactericide. Avoid overhead watering. Use disease-free seeds and transplants. Practice crop rotation.",
      "powdery mildew": "Apply sulfur-based or neem oil fungicide. Improve air circulation. Remove heavily infected leaves. Avoid excess nitrogen fertilization.",
      "mosaic virus": "No cure available. Remove and destroy infected plants to prevent spread. Control aphid populations as they transmit the virus. Use resistant varieties.",
    };

    const diseaseLower = disease.toLowerCase();
    for (const [key, rec] of Object.entries(recommendations)) {
      if (diseaseLower.includes(key)) {
        return rec;
      }
    }

    return "Consult with a local agricultural extension officer for specific treatment. Remove and isolate infected plants. Maintain good field hygiene and monitor regularly.";
  };

  const navItems = [
    { id: "home" as Screen, icon: Home, label: "Home" },
    { id: "sensor" as Screen, icon: Activity, label: "Sensors" },
    { id: "result" as Screen, icon: BarChart3, label: "Result" },
    { id: "history" as Screen, icon: FileText, label: "History" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Settings Dialog */}
      <SettingsDialog 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        onConfigSuccess={() => {
          setConfigRefreshKey(prev => prev + 1);
          setCurrentScreen("home");
        }}
      />
      
      {/* Mobile Container */}
      <div className="max-w-md mx-auto min-h-screen bg-background shadow-2xl flex flex-col">
        {/* Settings Button - Fixed Position */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5 text-primary" />
        </button>
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
          {currentScreen === "home" && (
            <HomeScreen
              key={configRefreshKey}
              selectedCrop={selectedCrop}
              onCropChange={setSelectedCrop}
              onCapture={handleCapture}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          )}
          {currentScreen === "sensor" && <SensorScreen sensorData={sensorData} />}
          {currentScreen === "result" && <ResultScreen result={predictionResult} isLoading={isLoading} />}
          {currentScreen === "history" && <HistoryScreen history={history} />}
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-border shadow-lg">
          <div className="grid grid-cols-4 gap-1 p-2">
            {navItems.map((item) => {
              const isActive = currentScreen === item.id;
              const Icon = item.icon;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentScreen(item.id)}
                  className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl transition-all ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className={`w-6 h-6 ${isActive ? "stroke-[2.5]" : ""}`} />
                  <span className="text-[11px] font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
