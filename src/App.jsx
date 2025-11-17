import React, { useEffect, useMemo, useState } from "react";
import StatCard from "./components/StatCard.jsx";
import Gauge from "./components/Gauge.jsx";
import Compass from "./components/Compass.jsx";
import SolarDial from "./components/SolarDial.jsx";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "";

function useTelemetry() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchOnce() {
      try {
        const res = await fetch(`${API_BASE}/api/telemetry`);
        if (!res.ok) throw new Error("Network error");
        const json = await res.json();
        if (mounted) setData(json);
      } catch (e) {
        if (mounted) setError(e.message);
      }
    }

    fetchOnce();
    const id = setInterval(fetchOnce, 1500);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  return { data, error };
}

function App() {
  const { data, error } = useTelemetry();
  const camo = data?.camouflage?.color_hsl || "hsl(200,70%,55%)";
  const danger = data?.danger_level || "low";

  const dangerColor = useMemo(() => {
    switch (danger) {
      case "high":
        return "from-rose-600/30 via-rose-700/10 to-slate-900";
      case "medium":
        return "from-amber-600/20 via-amber-700/10 to-slate-900";
      default:
        return "from-emerald-600/20 via-emerald-700/10 to-slate-900";
    }
  }, [danger]);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${dangerColor}`}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(circle at 20% 10%, rgba(59,130,246,0.08), transparent 40%), radial-gradient(circle at 80% 20%, rgba(16,185,129,0.08), transparent 40%)`
      }} />

      <div className="relative mx-auto max-w-6xl px-6 py-10">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl shadow-inner" style={{ background: camo }} />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">TOFY Control</h1>
              <p className="text-slate-300 text-sm">Bio-Rover TOFY-X1 • real-time telemetry</p>
            </div>
          </div>
          <div className="text-slate-300 text-xs">
            {data?.timestamp ? new Date(data.timestamp).toLocaleTimeString() : "—"}
          </div>
        </header>

        {error && (
          <div className="bg-rose-900/40 border border-rose-800 text-rose-100 rounded-lg p-3 mb-4">
            Napaka pri povezavi z API. Preveri VITE_BACKEND_URL.
          </div>
        )}

        {/* Top metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="Ambient temp" value={data?.environment?.ambient_temp_c ?? "—"} unit="°C" subtitle="DS18B20">
            <div className="w-6 h-6 rounded" style={{ background: camo }} />
          </StatCard>
          <StatCard title="Surface temp" value={data?.environment?.surface_temp_c ?? "—"} unit="°C" subtitle="Camouflage logic" />
          <StatCard title="UV index" value={data?.environment?.uv_index ?? "—"} unit="UVI" subtitle="SI1145" />
          <StatCard title="Light" value={data?.environment?.light_lux ? Math.round(data.environment.light_lux).toLocaleString() : "—"} unit="lux" subtitle="LDR" />
        </div>

        {/* Power + Solar + Compass */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-slate-300 text-xs uppercase">Battery</div>
              <div className="text-slate-400 text-xs">{data?.power?.battery_voltage ?? "—"} V</div>
            </div>
            <div className="flex items-center justify-center">
              <Gauge percent={data?.power?.battery_pct ?? 0} color={data?.power?.battery_pct < 30 ? "#f43f5e" : data?.power?.battery_pct < 60 ? "#f59e0b" : "#22c55e"} />
            </div>
          </div>

          <SolarDial target={data?.solar?.target_azimuth ?? 0} panel={data?.solar?.panel_azimuth ?? 0} lux={data?.solar?.light_lux ?? 0} />

          <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4 flex items-center justify-center">
            <Compass heading={data?.navigation?.heading ?? 0} />
          </div>
        </div>

        {/* Attitude + Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard title="Pitch" value={data?.attitude?.pitch ?? "—"} unit="°" />
          <StatCard title="Roll" value={data?.attitude?.roll ?? "—"} unit="°" />
          <StatCard title="Yaw" value={data?.attitude?.yaw ?? "—"} unit="°" />
        </div>

        {/* Camera + Map */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
            <div className="p-3 text-slate-300 text-xs uppercase">Camera</div>
            <div className="aspect-video bg-black/40">
              <img src={data?.image?.url || `${API_BASE}/api/image`.replace(/\/$/, "")} alt="Rover view" className="w-full h-full object-cover" onError={(e) => { e.target.style.opacity = 0.2; }} />
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <div className="text-slate-300 text-xs uppercase mb-2">Position</div>
            <div className="h-64 rounded-lg overflow-hidden relative">
              <div className="absolute inset-0 bg-[url('https://tile.openstreetmap.org/5/17/11.png')] opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-slate-200 text-sm">
                  {data?.navigation ? (
                    <>
                      <div>Lat: {data.navigation.lat}</div>
                      <div>Lon: {data.navigation.lon}</div>
                      <div>Speed: {data.navigation.speed_mps} m/s</div>
                    </>
                  ) : (
                    "No GPS"
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-8 text-slate-400 text-xs text-center">
          Bionika: kameleon (kamuflaža), kamela (oprijem), sončnica (sledenje soncu), metulj (odvajanje toplote), puščavska kača (nizko trenje)
        </footer>
      </div>
    </div>
  );
}

export default App;
