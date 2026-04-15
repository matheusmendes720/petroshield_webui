import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, MapPin, Activity } from 'lucide-react';
import { cn } from '../lib/utils';

interface ThreatEvent {
  id: string;
  lat: number;
  lng: number;
  type: 'SQLi' | 'DDoS' | 'Exfiltration' | 'SCADA';
  severity: 'critical' | 'warn' | 'info';
  location: string;
  timestamp: string;
}

export const ThreatMap: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [threats, setThreats] = useState<ThreatEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchThreats = async () => {
    try {
      const response = await fetch('/api/threats');
      const data = await response.json();
      setThreats(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching threats:', error);
    }
  };

  const simulateThreat = async () => {
    try {
      await fetch('/api/threats/simulate', { method: 'POST' });
      fetchThreats();
    } catch (error) {
      console.error('Error simulating threat:', error);
    }
  };

  useEffect(() => {
    fetchThreats();
    
    // Poll for updates every 5 seconds
    const pollInterval = setInterval(fetchThreats, 5000);
    
    // Simulate a new threat every 15 seconds to keep it dynamic
    const simulateInterval = setInterval(simulateThreat, 15000);

    if (!svgRef.current) return;

    const width = 800;
    const height = 450;
    const svg = d3.select(svgRef.current);
    
    // Projection
    const projection = d3.geoMercator()
      .scale(120)
      .translate([width / 2, height / 1.5]);

    const path = d3.geoPath().projection(projection);

    // Load world data (simplified GeoJSON)
    d3.json('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson').then((data: any) => {
      svg.selectAll('path')
        .data(data.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('fill', '#ffffff05')
        .attr('stroke', '#00f2ff10')
        .attr('stroke-width', 0.5);

      // Add grid lines
      const graticule = d3.geoGraticule();
      svg.append('path')
        .datum(graticule())
        .attr('class', 'graticule')
        .attr('d', path)
        .attr('fill', 'none')
        .attr('stroke', '#00f2ff05')
        .attr('stroke-width', 0.5);
    });

    return () => {
      clearInterval(pollInterval);
      clearInterval(simulateInterval);
    };
  }, []);

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 glass-panel p-6 rounded-lg border-white/5 relative overflow-hidden bg-black/40 min-h-[500px]">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-accent-red shadow-[0_0_8px_#ff3131] animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest text-accent-cyan">PetroShield Global Asset Map</span>
            </div>
            <div className="flex gap-4 text-[9px] uppercase tracking-widest text-white/40">
              <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-accent-red" /> Critical</span>
              <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-orange-500" /> Warning</span>
              <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-accent-cyan" /> Info</span>
            </div>
          </div>

          <div className="relative w-full h-full flex items-center justify-center">
            <svg 
              ref={svgRef} 
              viewBox="0 0 800 450" 
              className="w-full h-auto opacity-80"
            />
            
            {/* Threat Markers (React Overlay for better animation control) */}
            <div className="absolute inset-0 pointer-events-none">
              <AnimatePresence>
                {threats.map((threat) => {
                  const projection = d3.geoMercator()
                    .scale(120)
                    .translate([800 / 2, 450 / 1.5]);
                  const [x, y] = projection([threat.lng, threat.lat]) || [0, 0];
                  
                  // Scale to container size (approximate)
                  const left = `${(x / 800) * 100}%`;
                  const top = `${(y / 450) * 100}%`;

                  return (
                    <motion.div
                      key={threat.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto group"
                      style={{ left, top }}
                    >
                      <div className={cn(
                        "relative w-3 h-3 rounded-full cursor-help",
                        threat.severity === 'critical' && "bg-accent-red shadow-[0_0_12px_#ff3131]",
                        threat.severity === 'warn' && "bg-orange-500 shadow-[0_0_12px_#f97316]",
                        threat.severity === 'info' && "bg-accent-cyan shadow-[0_0_12px_#00f2ff]"
                      )}>
                        <motion.div 
                          animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className={cn(
                            "absolute inset-0 rounded-full",
                            threat.severity === 'critical' && "bg-accent-red",
                            threat.severity === 'warn' && "bg-orange-500",
                            threat.severity === 'info' && "bg-accent-cyan"
                          )}
                        />
                      </div>

                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                        <div className="glass-panel p-3 rounded border border-white/10 whitespace-nowrap bg-black/90">
                          <p className="text-[10px] font-bold text-white uppercase tracking-widest mb-1">{threat.type}</p>
                          <p className="text-[9px] text-white/60 font-mono">{threat.location}</p>
                          <p className="text-[8px] text-white/40 font-mono mt-1">
                            {new Date(threat.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-lg border-white/5 bg-black/20">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-4 h-4 text-accent-cyan" />
            <span className="text-[10px] uppercase tracking-widest text-accent-cyan">Active Incidents</span>
          </div>
          
          <div className="space-y-4">
            {threats.map((threat) => (
              <div key={threat.id} className="p-4 rounded bg-white/3 border border-white/5 hover:bg-white/5 transition-all">
                <div className="flex justify-between items-start mb-2">
                  <span className={cn(
                    "text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-widest",
                    threat.severity === 'critical' ? "bg-accent-red/20 text-accent-red" :
                    threat.severity === 'warn' ? "bg-orange-500/20 text-orange-500" :
                    "bg-accent-cyan/20 text-accent-cyan"
                  )}>
                    {threat.severity}
                  </span>
                  <span className="text-[8px] font-mono text-white/30">
                    {new Date(threat.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-[11px] font-bold text-white uppercase tracking-wider">{threat.type} DETECTED</p>
                <div className="flex items-center gap-1.5 mt-2 text-[9px] text-white/50 font-mono">
                  <MapPin className="w-3 h-3" />
                  {threat.location}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
