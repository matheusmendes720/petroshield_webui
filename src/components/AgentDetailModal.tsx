import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Activity, Shield, Cpu, Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface AgentLog {
  timestamp: string;
  action: string;
  status: string;
  details: string;
}

interface AgentDetailModalProps {
  agent: { label: string; status: string; score: number } | null;
  onClose: () => void;
}

export const AgentDetailModal: React.FC<AgentDetailModalProps> = ({ agent, onClose }) => {
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (agent) {
      setLoading(true);
      fetch(`/api/agents/${agent.label}/logs`)
        .then(res => res.json())
        .then(data => {
          setLogs(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [agent]);

  if (!agent) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="glass-panel w-full max-w-2xl bg-[#05070a] border-white/10 rounded-xl overflow-hidden shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-accent-cyan/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-accent-cyan/10">
                <Cpu className="w-5 h-5 text-accent-cyan" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white font-mono">{agent.label}</h2>
                <p className="text-[10px] uppercase tracking-widest text-white/40">Autonomous Agent Profile</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto scrollbar-hide">
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-white/3 border border-white/5">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/40 mb-2">
                  <Activity className="w-3 h-3" />
                  <span>Reliability</span>
                </div>
                <p className="text-xl font-bold text-accent-cyan font-mono">{(agent.score * 100).toFixed(1)}%</p>
              </div>
              <div className="p-4 rounded-lg bg-white/3 border border-white/5">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/40 mb-2">
                  <Shield className="w-3 h-3" />
                  <span>Status</span>
                </div>
                <p className="text-xl font-bold text-accent-green font-mono">{agent.status}</p>
              </div>
              <div className="p-4 rounded-lg bg-white/3 border border-white/5">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/40 mb-2">
                  <Clock className="w-3 h-3" />
                  <span>Uptime</span>
                </div>
                <p className="text-xl font-bold text-white font-mono">99.9%</p>
              </div>
            </div>

            {/* Performance Chart Placeholder */}
            <div className="space-y-4">
              <h3 className="text-[11px] uppercase tracking-widest text-accent-cyan">Performance Baseline</h3>
              <div className="h-24 w-full flex items-end gap-1 px-2">
                {Array.from({ length: 24 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.random() * 60 + 40}%` }}
                    className="flex-1 bg-accent-cyan/20 rounded-t-sm border-t border-accent-cyan/50"
                  />
                ))}
              </div>
            </div>

            {/* Recent Logs */}
            <div className="space-y-4">
              <h3 className="text-[11px] uppercase tracking-widest text-accent-cyan">Recent Actions & Logs</h3>
              <div className="space-y-3">
                {loading ? (
                  <div className="text-center py-8 text-white/20 font-mono text-xs animate-pulse">
                    FETCHING AGENT TELEMETRY...
                  </div>
                ) : logs.map((log, i) => (
                  <div key={i} className="p-4 rounded-lg bg-white/3 border border-white/5 flex gap-4">
                    <div className="mt-1">
                      <CheckCircle2 className="w-4 h-4 text-accent-green" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-center">
                        <p className="text-xs font-bold text-white">{log.action}</p>
                        <span className="text-[9px] font-mono text-white/20">{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-[11px] text-white/60 leading-relaxed">{log.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 bg-white/3 border-t border-white/5 flex justify-end">
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-accent-cyan/10 hover:bg-accent-cyan/20 border border-accent-cyan/30 text-accent-cyan text-[11px] uppercase tracking-widest rounded transition-all"
            >
              Close Profile
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
