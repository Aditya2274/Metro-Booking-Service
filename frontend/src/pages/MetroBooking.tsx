import { useState, useMemo } from "react";
import { Train, ArrowRight, Clock, Repeat, AlertCircle, Ticket, QrCode } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { QRCodeCanvas as QRCode } from "qrcode.react";

const STATIONS = [
  { id: "S1", name: "Station A" },
  { id: "S2", name: "Station B" },
  { id: "S3", name: "Station C - Interchange" },
  { id: "S4", name: "Station D" },
  { id: "S5", name: "Station E" },
];


function generateQRHash(src: string, dest: string): string {
  const ts = Date.now().toString(36).toUpperCase();
  return `METRO-${src}-${dest}-${ts}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

const stationName = (id: string) => STATIONS.find((s) => s.id === id)?.name ?? id;

const MetroBooking = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [error, setError] = useState("");
  const [trip, setTrip] = useState<{ stops: string[]; time: number; transfers: number; qrHash: string } | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleFind = async () => {
    setError("");
    setShowResult(false);

    if (!source || !destination) {
      setError("Please select both source and destination stations.");
      return;
    }
    if (source === destination) {
      setError("Source and destination cannot be the same station.");
      return;
    }

    try {
      // 1. Call your Spring Boot API
      const response = await fetch("http://localhost:8090/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ source, destination }),
      });

      const data = await response.json();

      // 2. Handle backend errors (e.g., "No path exists")
      if (data.error) {
        setError(data.error);
        return;
      }

      // 3. Map the Spring Boot JSON response to your UI state
      setTrip({ 
        stops: data.routeTaken, 
        time: data.totalTimeMins, 
        transfers: data.transfers, 
        qrHash: data.qrString 
      });
      
      // Small delay for transition feel
      setTimeout(() => setShowResult(true), 50);

    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to connect to backend. Is Spring Boot running on port 8090?");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-metro-red/15 flex items-center justify-center">
              <Train className="w-5 h-5 text-metro-red" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground tracking-tight">Metro Booking Service</h1>
              <p className="text-xs text-muted-foreground">Smart Transit · Instant Tickets</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-severity-success/10 text-severity-success text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-severity-success animate-pulse-soft" />
            All Lines Operational
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left Panel – Booking Input */}
          <Card className="card-glow">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Ticket className="w-4 h-4 text-metro-blue" />
                Book Your Journey
              </CardTitle>
              <p className="text-xs text-muted-foreground">Select stations to find the fastest route</p>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Source */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">From</label>
                <Select value={source} onValueChange={setSource}>
                  <SelectTrigger className="bg-secondary border-border h-11">
                    <SelectValue placeholder="Select source station" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border z-50">
                    {STATIONS.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-metro-blue" />
                          {s.name} ({s.id})
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Direction arrow */}
              <div className="flex justify-center">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-muted-foreground rotate-90" />
                </div>
              </div>

              {/* Destination */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">To</label>
                <Select value={destination} onValueChange={setDestination}>
                  <SelectTrigger className="bg-secondary border-border h-11">
                    <SelectValue placeholder="Select destination station" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border z-50">
                    {STATIONS.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-metro-red" />
                          {s.name} ({s.id})
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Error */}
              {error && (
                <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription className="text-sm">{error}</AlertDescription>
                </Alert>
              )}

              {/* Button */}
              <Button
                onClick={handleFind}
                className="w-full h-12 bg-metro-red hover:bg-metro-red/90 text-metro-red-foreground font-semibold text-sm tracking-wide"
              >
                <Train className="w-4 h-4 mr-2" />
                Find Route & Generate Ticket
              </Button>
            </CardContent>
          </Card>

          {/* Right Panel – Trip Visualization & Ticket */}
          <div
            className={`transition-all duration-500 ease-out ${
              showResult && trip ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
            }`}
          >
            {trip && (
              <Card className="card-glow overflow-hidden">
                <CardHeader className="pb-3 border-b border-border">
                  <CardTitle className="text-base flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-metro-blue" />
                    Your Trip Ticket
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-5 space-y-6">
                  {/* KPI Row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-secondary/60 border border-border p-4 text-center">
                      <Clock className="w-4 h-4 text-metro-blue mx-auto mb-1" />
                      <p className="text-2xl font-bold text-foreground">{trip.time}</p>
                      <p className="text-xs text-muted-foreground">Minutes</p>
                    </div>
                    <div className="rounded-lg bg-secondary/60 border border-border p-4 text-center">
                      <Repeat className="w-4 h-4 text-metro-red mx-auto mb-1" />
                      <p className="text-2xl font-bold text-foreground">{trip.transfers}</p>
                      <p className="text-xs text-muted-foreground">Transfers</p>
                    </div>
                  </div>

                  {/* Route Timeline */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Route</p>
                    <div className="space-y-0">
                      {trip.stops.map((stopId, i) => {
                        const isFirst = i === 0;
                        const isLast = i === trip.stops.length - 1;
                        const isInterchange = stopId === "S3" && !isFirst && !isLast;

                        return (
                          <div key={i}>
                            {/* Transfer badge before interchange */}
                            {isInterchange && (
                              <div className="flex items-center gap-3 pl-[7px] py-1">
                                <div className="w-[2px] h-4 bg-metro-red/40" />
                                <Badge className="bg-metro-red/15 text-metro-red border-metro-red/30 text-[10px] px-2">
                                  <Repeat className="w-3 h-3 mr-1" />
                                  Transfer Required
                                </Badge>
                              </div>
                            )}

                            <div className="flex items-center gap-3">
                              {/* Dot + Line */}
                              <div className="flex flex-col items-center">
                                <div
                                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                    isFirst || isLast
                                      ? "border-metro-blue bg-metro-blue/20"
                                      : isInterchange
                                        ? "border-metro-red bg-metro-red/20"
                                        : "border-muted-foreground/40 bg-secondary"
                                  }`}
                                >
                                  {(isFirst || isLast) && <div className="w-1.5 h-1.5 rounded-full bg-metro-blue" />}
                                  {isInterchange && <div className="w-1.5 h-1.5 rounded-full bg-metro-red" />}
                                </div>
                              </div>

                              {/* Station info */}
                              <div className="flex-1 py-2">
                                <p
                                  className={`text-sm font-medium ${
                                    isFirst || isLast ? "text-foreground" : "text-muted-foreground"
                                  }`}
                                >
                                  {stationName(stopId)}
                                </p>
                                <p className="text-[11px] text-muted-foreground/60">{stopId}</p>
                              </div>

                              {/* Terminal badges */}
                              {isFirst && (
                                <Badge variant="outline" className="text-[10px] border-metro-blue/30 text-metro-blue">
                                  Origin
                                </Badge>
                              )}
                              {isLast && (
                                <Badge variant="outline" className="text-[10px] border-severity-success/30 text-severity-success">
                                  Destination
                                </Badge>
                              )}
                            </div>

                            {/* Connecting line */}
                            {!isLast && (
                              <div className="flex items-center gap-3 pl-[7px]">
                                <div className={`w-[2px] h-5 ${isInterchange ? "bg-metro-red/40" : "bg-border"}`} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* QR Ticket Section */}
                  <div className="border-t border-dashed border-border pt-5">
                    <div className="flex flex-col items-center gap-3">
                      {/* Mock QR Code */}
                      <QRCode value={trip.qrHash} size={144} level="H" includeMargin={true} />
                      <p className="text-[11px] font-mono text-muted-foreground text-center break-all max-w-[280px] leading-relaxed">
                        {trip.qrHash}
                      </p>
                      <p className="text-[10px] text-muted-foreground/50">Scan at entry gate · Valid for 60 minutes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MetroBooking;
