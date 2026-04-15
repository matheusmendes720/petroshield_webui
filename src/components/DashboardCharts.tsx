import React, { useEffect, useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, LineChart, Line, Legend
} from 'recharts';

const data = [
  { name: '00:00', threats: 45, blocked: 44, savings: 1200 },
  { name: '04:00', threats: 52, blocked: 52, savings: 1500 },
  { name: '08:00', threats: 88, blocked: 85, savings: 3200 },
  { name: '12:00', threats: 65, blocked: 65, savings: 2100 },
  { name: '16:00', threats: 120, blocked: 118, savings: 5400 },
  { name: '20:00', threats: 95, blocked: 95, savings: 2800 },
];

const COLORS = ['#00f2ff', '#39ff14', '#ff3131', '#FFD700'];

export const ScadaHealthChart: React.FC = () => {
  const [healthData, setHealthData] = useState([]);

  useEffect(() => {
    fetch('/api/charts/scada-health')
      .then(res => res.json())
      .then(data => setHealthData(data));
  }, []);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={healthData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="#ffffff20" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="#ffffff20" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
            domain={[80, 100]}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#05070a', border: '1px solid #00f2ff20', borderRadius: '4px' }}
            itemStyle={{ fontSize: '11px', fontFamily: 'Courier New' }}
          />
          <Legend 
            wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', paddingTop: '10px' }}
          />
          <Line type="monotone" dataKey="FPSO_P93" stroke="#00f2ff" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="REPLAN" stroke="#39ff14" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="REDUC" stroke="#ff3131" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="P-93" stroke="#FFD700" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ThreatTrendChart: React.FC = () => (
  <div className="h-[300px] w-full">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#39ff14" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#39ff14" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
        <XAxis 
          dataKey="name" 
          stroke="#ffffff20" 
          fontSize={10} 
          tickLine={false} 
          axisLine={false} 
        />
        <YAxis 
          stroke="#ffffff20" 
          fontSize={10} 
          tickLine={false} 
          axisLine={false} 
        />
        <Tooltip 
          contentStyle={{ backgroundColor: '#05070a', border: '1px solid #00f2ff20', borderRadius: '4px' }}
          itemStyle={{ fontSize: '11px', fontFamily: 'Courier New' }}
        />
        <Area 
          type="monotone" 
          dataKey="threats" 
          stroke="#00f2ff" 
          fillOpacity={1} 
          fill="url(#colorThreats)" 
          strokeWidth={2}
        />
        <Area 
          type="monotone" 
          dataKey="blocked" 
          stroke="#39ff14" 
          fillOpacity={1} 
          fill="url(#colorBlocked)" 
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export const SavingsChart: React.FC = () => (
  <div className="h-[300px] w-full">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
        <XAxis 
          dataKey="name" 
          stroke="#ffffff20" 
          fontSize={10} 
          tickLine={false} 
          axisLine={false} 
        />
        <YAxis 
          stroke="#ffffff20" 
          fontSize={10} 
          tickLine={false} 
          axisLine={false} 
        />
        <Tooltip 
          cursor={{ fill: '#ffffff05' }}
          contentStyle={{ backgroundColor: '#05070a', border: '1px solid #00f2ff20', borderRadius: '4px' }}
        />
        <Bar dataKey="savings" radius={[2, 2, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);
