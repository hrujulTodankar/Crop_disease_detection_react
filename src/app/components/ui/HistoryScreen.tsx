import { Calendar, Leaf, CheckCircle, AlertTriangle } from "lucide-react";
import { Card } from "@/app/components/ui/card";

interface HistoryEntry {
  id: string;
  cropName: string;
  date: Date;
  disease: string;
  isHealthy: boolean;
}

interface HistoryScreenProps {
  history: HistoryEntry[];
}

export function HistoryScreen({ history }: HistoryScreenProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-[26px] font-semibold text-foreground mb-2">History & Logs</h2>
        <p className="text-[16px] text-muted-foreground">
          {history.length} {history.length === 1 ? 'record' : 'records'} found
        </p>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {history.length === 0 ? (
          <Card className="p-12 shadow-md">
            <div className="text-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-10 h-10 text-muted-foreground" />
              </div>
              <p className="text-[18px] text-muted-foreground">No history available</p>
              <p className="text-[15px] text-muted-foreground mt-2">
                Start by capturing a leaf image
              </p>
            </div>
          </Card>
        ) : (
          history.map((entry) => (
            <Card key={entry.id} className="p-5 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  entry.isHealthy ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {entry.isHealthy ? (
                    <CheckCircle className="w-7 h-7 text-[#22c55e]" />
                  ) : (
                    <AlertTriangle className="w-7 h-7 text-[#ef4444]" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <Leaf className="w-4 h-4 text-primary shrink-0" />
                      <h3 className="text-[18px] font-semibold text-foreground">
                        {entry.cropName}
                      </h3>
                    </div>
                    <span className={`text-[15px] font-medium px-3 py-1 rounded-full ${
                      entry.isHealthy 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {entry.disease}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-[14px] text-muted-foreground mt-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(entry.date)}</span>
                    </div>
                    <span>•</span>
                    <span>{formatTime(entry.date)}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Summary Card */}
      {history.length > 0 && (
        <Card className="p-6 shadow-md bg-secondary/30 border-secondary">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-[14px] text-muted-foreground mb-1">Total Scans</p>
              <p className="text-[28px] font-bold text-primary">{history.length}</p>
            </div>
            <div className="text-center">
              <p className="text-[14px] text-muted-foreground mb-1">Healthy Crops</p>
              <p className="text-[28px] font-bold text-[#22c55e]">
                {history.filter(h => h.isHealthy).length}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
export default HistoryScreen;