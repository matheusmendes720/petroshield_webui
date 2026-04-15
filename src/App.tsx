import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Terminal as TerminalIcon, 
  BarChart3, 
  Activity, 
  Settings, 
  Zap, 
  Lock, 
  Database,
  Cpu,
  AlertTriangle,
  ChevronRight,
  Menu,
  X,
  TrendingUp,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { Terminal } from './components/Terminal';
import { ThreatTrendChart, SavingsChart, ScadaHealthChart } from './components/DashboardCharts';
import { Radar } from './components/Radar';
import { ThreatMap } from './components/ThreatMap';
import { AgentDetailModal } from './components/AgentDetailModal';
import { cn } from './lib/utils';

type Page = 'ops' | 'map' | 'dlp' | 'profit' | 'eval';

export default function App() {
  const [activePage, setActivePage] = useState<Page>('ops');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [stats, setStats] = useState({
    threatsBlocked: 1248,
    dataSaves: '4.2 TB',
    profitSaved: '$12.5M',
    systemHealth: 99.2,
    agentEfficiency: 98.5,
    dlpPrevention: 99.98
  });
  const [vendors, setVendors] = useState<any[]>([]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();
      setStats(prev => ({ ...prev, ...data }));
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchVendors = async () => {
    try {
      const response = await fetch('/api/vendors');
      const data = await response.json();
      setVendors(data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchVendors();
    const interval = setInterval(() => {
      fetchStats();
      fetchVendors();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const NavItem = ({ label, id, active }: { label: string, id: Page, active: boolean }) => (
    <button
      onClick={() => setActivePage(id)}
      className={cn(
        "px-4 py-2 text-[11px] uppercase tracking-widest transition-all duration-300 relative",
        active ? "text-accent-cyan" : "text-white/40 hover:text-white/60"
      )}
    >
      {label}
      {active && (
        <motion.div 
          layoutId="nav-active"
          className="absolute bottom-0 left-4 right-4 h-0.5 bg-accent-cyan shadow-[0_0_10px_#00f2ff]"
        />
      )}
    </button>
  );

  return (
    <div className="min-h-screen flex bg-bg-dark circuit-bg selection:bg-accent-cyan/30 relative p-4">
      <div className="absolute inset-0 glow-overlay pointer-events-none z-0" />
      
      <div className="flex-1 flex flex-col glass-panel rounded-xl border border-glass-border overflow-hidden relative z-10">
        {/* Header */}
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-black/40">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-accent-green shadow-[0_0_8px_#39ff14] animate-pulse" />
            <h1 className="text-lg font-bold tracking-[2px] text-white uppercase flex items-center gap-2">
              NEBULA SOC <span className="text-white/20">/</span> <span className="text-accent-cyan">UNIT-01</span>
            </h1>
          </div>

          <nav className="flex items-center gap-2">
            <NavItem label="Ops Center" id="ops" active={activePage === 'ops'} />
            <NavItem label="Threat Map" id="map" active={activePage === 'map'} />
            <NavItem label="DLP Analysis" id="dlp" active={activePage === 'dlp'} />
            <NavItem label="Profit Matrix" id="profit" active={activePage === 'profit'} />
            <NavItem label="System Eval" id="eval" active={activePage === 'eval'} />
          </nav>
          
          <div className="flex items-center gap-6 text-[9px] uppercase tracking-widest font-mono text-white/40">
            <div className="text-right">
              <p>System Load: 14%</p>
              <p>Active Agents: 08</p>
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <aside className="w-72 border-r border-white/10 p-8 flex flex-col gap-8 bg-black/20">
            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-widest text-white/40">Total Profit Saved (MTD)</span>
              <div className="text-2xl font-bold text-white font-mono">{stats.profitSaved}</div>
              <div className="text-[10px] text-accent-green flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +14.2% vs Prev Qtr
              </div>
            </div>

            <div className="space-y-4">
              <span className="text-[9px] uppercase tracking-widest text-white/40">Vendor Risk Spotlight</span>
              <div className="space-y-2">
                {vendors.filter(v => v.riskLevel === 'CRITICAL').map(vendor => (
                  <div key={vendor.id} className="p-3 rounded-lg bg-accent-red/5 border border-accent-red/20">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-bold text-white uppercase">{vendor.name}</span>
                      <span className="text-[8px] px-1 bg-accent-red/20 text-accent-red rounded font-bold">CRITICAL</span>
                    </div>
                    <div className="text-[9px] text-white/40 font-mono">Risk Score: {vendor.riskScore}</div>
                    {vendor.id === 'OCEANICA_ENG' && (
                      <div className="mt-2 text-[8px] text-accent-red animate-pulse flex items-center gap-1">
                        <AlertTriangle className="w-2 h-2" /> AUTO-SUSPEND TRIGGERED
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-white/3 border-l-2 border-accent-cyan/50">
              <span className="text-[9px] uppercase tracking-widest text-white/40">DLP Shield Status</span>
              <div className="text-xl font-bold text-white font-mono mt-1">{stats.dlpPrevention}%</div>
              <div className="text-[10px] text-accent-cyan mt-1">90GB Leak Prevented</div>
            </div>

            <div className="mt-auto space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-[9px] uppercase tracking-widest text-white/40">
                  <span>Agent Reliability</span>
                  <span className="text-accent-cyan">{stats.agentEfficiency}%</span>
                </div>
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.agentEfficiency}%` }}
                    className="h-full bg-accent-cyan shadow-[0_0_10px_#00f2ff]" 
                  />
                </div>
                <div className="text-[9px] uppercase tracking-widest text-white/40 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
                  LUMEN-7: ACTIVE
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 p-8 overflow-y-auto scrollbar-hide bg-black/10">
            <AnimatePresence mode="wait">
              {activePage === 'ops' && (
                <motion.div
                  key="ops"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 h-[280px]">
                      <div className="glass-panel p-6 rounded-lg border-white/5 relative overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                          <span className="text-[10px] uppercase tracking-widest text-accent-cyan">Threat Propagation Velocity</span>
                          <span className="text-[10px] font-mono text-accent-cyan opacity-60">实时监控</span>
                        </div>
                        <div className="h-32 w-full flex items-end gap-2 px-4">
                          {[20, 35, 45, 65, 75, 55, 40, 60].map((h, i) => (
                            <div 
                              key={i} 
                              className="flex-1 bg-gradient-to-t from-accent-cyan/20 to-accent-cyan/80 rounded-t-sm"
                              style={{ height: `${h}%` }} 
                            />
                          ))}
                        </div>
                        <div className="flex justify-between mt-4 text-[8px] font-mono text-white/20 px-4">
                          <span>08:00</span>
                          <span>12:00</span>
                          <span>16:00</span>
                          <span>20:00</span>
                        </div>
                      </div>

                      <div className="glass-panel rounded-lg border-white/5 overflow-hidden relative">
                        <div className="absolute top-6 left-6 z-10">
                          <span className="text-[10px] uppercase tracking-widest text-accent-cyan">SCADA Defensive Grid</span>
                        </div>
                        <Radar />
                      </div>
                    </div>

                    <div className="glass-panel p-6 rounded-lg border-white/5">
                      <span className="text-[10px] uppercase tracking-widest text-accent-cyan mb-4 block">Live Threat Feed</span>
                      <div className="space-y-3">
                        {[
                          { time: '14:22:01', msg: 'SQLi Attempt blocked at Refinery DMZ', type: 'critical' },
                          { time: '14:18:55', msg: 'Unusual traffic pattern in HR subnet', type: 'warn' },
                          { time: '14:10:12', msg: 'DLP Trigger: Unauthorized exfil', type: 'critical' },
                          { time: '14:05:30', msg: 'Modbus packet isolated on Port 502', type: 'info' },
                        ].map((alert, i) => (
                          <div 
                            key={i} 
                            className={cn(
                              "p-3 rounded border text-[11px] transition-all hover:bg-white/5",
                              alert.type === 'critical' ? "bg-accent-red/10 border-accent-red/30" : "bg-white/3 border-white/10"
                            )}
                          >
                            <span className="opacity-60 text-[9px] block mb-1 font-mono">{alert.time}</span>
                            <p className="text-white/90 truncate">{alert.msg}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="glass-panel p-6 rounded-lg border-white/5">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-[10px] uppercase tracking-widest text-accent-cyan">Historical SCADA Asset Health (24h)</span>
                      <div className="flex gap-4 text-[8px] uppercase tracking-widest text-white/40">
                        <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-accent-cyan" /> FPSO_P93</span>
                        <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-accent-green" /> REPLAN</span>
                        <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-accent-red" /> REDUC</span>
                        <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-yellow-400" /> P-93</span>
                      </div>
                    </div>
                    <ScadaHealthChart />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="glass-panel p-4 rounded-lg border-accent-cyan/20 flex items-center gap-4">
                      <div className="w-10 h-10 rounded bg-accent-cyan/10 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-accent-cyan" />
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-white/40">SCADA Protection</p>
                        <p className="text-lg font-bold text-white">ACTIVE</p>
                      </div>
                    </div>
                    <div className="glass-panel p-4 rounded-lg border-accent-green/20 flex items-center gap-4">
                      <div className="w-10 h-10 rounded bg-accent-green/10 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-accent-green" />
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-white/40">DLP Shield</p>
                        <p className="text-lg font-bold text-white">ENFORCED</p>
                      </div>
                    </div>
                    <div className="glass-panel p-4 rounded-lg border-accent-red/20 flex items-center gap-4">
                      <div className="w-10 h-10 rounded bg-accent-red/10 flex items-center justify-center">
                        <Database className="w-5 h-5 text-accent-red" />
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-white/40">Data Integrity</p>
                        <p className="text-lg font-bold text-white">VERIFIED</p>
                      </div>
                    </div>
                  </div>

                  <div className="min-h-[400px]">
                    <Terminal />
                  </div>
                </motion.div>
              )}

              {activePage === 'map' && (
                <motion.div
                  key="map"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="h-full"
                >
                  <ThreatMap />
                </motion.div>
              )}

              {activePage === 'dlp' && (
                <motion.div
                  key="dlp"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-panel p-6 rounded-lg border-white/5">
                      <ShieldCheck className="w-6 h-6 text-accent-cyan mb-4" />
                      <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Exfiltration Attempts</p>
                      <p className="text-2xl font-bold text-white font-mono">1,248</p>
                    </div>
                    <div className="glass-panel p-6 rounded-lg border-white/5">
                      <Globe className="w-6 h-6 text-accent-green mb-4" />
                      <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Protected Endpoints</p>
                      <p className="text-2xl font-bold text-white font-mono">4,502</p>
                    </div>
                    <div className="glass-panel p-6 rounded-lg border-white/5">
                      <Lock className="w-6 h-6 text-accent-red mb-4" />
                      <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Policy Violations</p>
                      <p className="text-2xl font-bold text-white font-mono">0</p>
                    </div>
                  </div>
                  <div className="glass-panel p-8 rounded-lg border-white/5">
                    <h3 className="text-[11px] uppercase tracking-widest text-accent-cyan mb-8">DLP Detection Trend (24h)</h3>
                    <ThreatTrendChart />
                  </div>
                </motion.div>
              )}

              {activePage === 'profit' && (
                <motion.div
                  key="profit"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-panel p-8 rounded-lg border-white/5">
                      <h3 className="text-[11px] uppercase tracking-widest text-accent-cyan mb-8">Profit Saved by Sector</h3>
                      <SavingsChart />
                    </div>
                    <div className="space-y-4">
                      {[
                        { sector: 'SCADA Infrastructure', amount: '$5.2M', trend: '+8%' },
                        { sector: 'Data Loss Prevention', amount: '$4.1M', trend: '+12%' },
                        { sector: 'Network Security', amount: '$2.1M', trend: '+5%' },
                        { sector: 'IoT Defense', amount: '$1.08M', trend: '+15%' },
                      ].map((item, i) => (
                        <div key={i} className="glass-panel p-6 rounded-lg border-white/5 flex justify-between items-center">
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">{item.sector}</p>
                            <p className="text-xl font-bold text-white font-mono">{item.amount}</p>
                          </div>
                          <span className="text-accent-green text-xs font-mono">{item.trend}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activePage === 'eval' && (
                <motion.div
                  key="eval"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                  <div className="glass-panel p-8 rounded-lg border-white/5">
                    <h3 className="text-[11px] uppercase tracking-widest text-accent-cyan mb-8">SCADA Node Integrity</h3>
                    <div className="space-y-6">
                      {['Pipeline-A', 'Refinery-04', 'Storage-Hub', 'Offshore-Rig-7'].map((node, i) => (
                        <div key={node} className="space-y-2">
                          <div className="flex justify-between text-[10px] font-mono">
                            <span className="text-white/60 uppercase tracking-widest">{node}</span>
                            <span className="text-accent-green">99.9%</span>
                          </div>
                          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: '99.9%' }}
                              transition={{ delay: i * 0.1, duration: 1 }}
                              className="h-full bg-accent-cyan shadow-[0_0_10px_rgba(0,242,255,0.5)]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="glass-panel p-8 rounded-lg border-white/5">
                    <h3 className="text-[11px] uppercase tracking-widest text-accent-cyan mb-8">Agentic Loop Performance</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'DLP_AGENT_01', status: 'Optimal', score: 0.98 },
                        { label: 'SCADA_GUARD_04', status: 'Optimal', score: 0.99 },
                        { label: 'NETWORK_SCAN_02', status: 'Learning', score: 0.85 },
                        { label: 'AUTH_SENTRY_09', status: 'Optimal', score: 0.97 },
                      ].map((agent, i) => (
                        <motion.div 
                          key={i} 
                          whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedAgent(agent)}
                          className="p-4 rounded-lg bg-white/3 border border-white/5 cursor-pointer transition-all"
                        >
                          <p className="text-[9px] font-mono text-white/40 mb-1">{agent.label}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white">{agent.status}</span>
                            <span className="text-xs text-accent-cyan font-mono">{(agent.score * 100).toFixed(0)}%</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>

        {/* Global Modal */}
        <AgentDetailModal 
          agent={selectedAgent} 
          onClose={() => setSelectedAgent(null)} 
        />
      </div>
    </div>
  );
}
