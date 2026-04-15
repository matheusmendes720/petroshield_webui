import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal as TerminalIcon, ChevronRight, Cpu, ShieldAlert, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

interface LogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'warn' | 'error' | 'success' | 'agent';
  message: string;
}

export const Terminal: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
    };
    setLogs((prev) => [...prev.slice(-50), newLog]);
  };

  useEffect(() => {
    addLog('Initializing Agent LUMEN-7... OK', 'info');
    addLog('Scanning Star Schema records for Petrol Distribution...', 'agent');
    addLog('Identified anomaly in SCADA Protocol: Node_ID 492 (Valve Pressure)', 'agent');
    addLog('AxeGuard Middleware: ACTIVE', 'success');
    
    const fetchAuditLogs = async () => {
      try {
        const response = await fetch('/api/threats');
        const data = await response.json();
        const latest = data[0];
        if (latest) {
          if (latest.type === "DLP Breach Attempt") {
            addLog(`[AXEGUARD] Leak Prevented at ${latest.location}`, 'warn');
            addLog(`[SANITIZED] ${latest.query}`, 'agent');
            addLog(`[ACTION] Redacted & Logged (Score: ${latest.severity})`, 'success');
          } else {
            addLog(`[SYSTEM] Query from ${latest.location}: ${latest.query}`, 'info');
          }
        }
      } catch (error) {
        console.error('Error fetching audit logs:', error);
      }
    };

    const interval = setInterval(fetchAuditLogs, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    addLog(`system@nebula-soc:~$ ${input}`, 'info');
    
    const cmd = input.toLowerCase().trim();
    if (cmd === 'help') {
      addLog('Available commands: help, status, scan, agent-eval, clear', 'info');
    } else if (cmd === 'status') {
      addLog('System Status: OPERATIONAL', 'success');
      addLog('Active Threats: 0', 'success');
      addLog('Profit Saved (Today): $42,400', 'agent');
    } else if (cmd === 'scan') {
      addLog('Initiating deep scan of SCADA assets...', 'warn');
      setTimeout(() => addLog('Scan complete. No vulnerabilities found.', 'success'), 2000);
    } else if (cmd === 'clear') {
      setLogs([]);
    } else {
      addLog(`Command not recognized: ${cmd}`, 'error');
    }

    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-black rounded-lg overflow-hidden border border-accent-cyan/30 shadow-[0_0_30px_rgba(0,242,255,0.05)]">
      <div 
        ref={scrollRef}
        className="flex-1 p-6 font-mono text-[13px] overflow-y-auto space-y-1 scrollbar-hide"
      >
        <div className="text-accent-cyan mb-2">system@nebula-soc:~$ agent-loop --eval --mode=defensive</div>
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "flex gap-3",
                log.type === 'error' && "text-accent-red",
                log.type === 'warn' && "text-orange-400",
                log.type === 'success' && "text-accent-green",
                log.type === 'agent' && "text-accent-green",
                log.type === 'info' && "text-accent-green"
              )}
            >
              <span className="shrink-0 font-bold">
                {log.type === 'info' && '[INFO]'}
                {log.type === 'warn' && '[WARN]'}
                {log.type === 'error' && '[ERROR]'}
                {log.type === 'success' && '[RESULT]'}
                {log.type === 'agent' && '[AGENT]'}
              </span>
              <span className="break-all">{log.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-accent-cyan">system@nebula-soc:~$</span>
          <motion.div 
            animate={{ opacity: [1, 1, 0, 0] }}
            transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
            className="w-2 h-4 bg-accent-cyan shadow-[0_0_8px_#00f2ff]" 
          />
        </div>
      </div>

      <form onSubmit={handleCommand} className="px-6 py-4 bg-black border-t border-white/5 flex items-center gap-2 relative">
        <span className="text-accent-cyan font-mono text-sm">system@nebula-soc:~$</span>
        <div className="relative flex-1 flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-transparent border-none outline-none flex-1 font-mono text-accent-cyan placeholder:text-accent-cyan/20 z-10"
            placeholder="Enter command..."
            autoFocus
          />
          {input === '' && (
            <motion.div 
              animate={{ opacity: [1, 1, 0, 0] }}
              transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
              className="absolute left-0 w-2 h-4 bg-accent-cyan/50 pointer-events-none"
            />
          )}
        </div>
      </form>
    </div>
  );
};
