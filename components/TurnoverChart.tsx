import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// Fix: Correct import path for types.
import type { TurnoverDataPoint } from '../types';

const data: TurnoverDataPoint[] = [
    { name: 'Jan', 'Turnover %': 4.2 },
    { name: 'Feb', 'Turnover %': 3.8 },
    { name: 'Mar', 'Turnover %': 3.5 },
    { name: 'Apr', 'Turnover %': 4.0 },
    { name: 'May', 'Turnover %': 2.9 },
    { name: 'Jun', 'Turnover %': 3.1 },
];

export const TurnoverChart: React.FC = () => {
    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <LineChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 20,
                        left: 0,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={{ stroke: '#E5E7EB' }} tickLine={false} />
                    <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} unit="%"/>
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}/>
                    <Legend wrapperStyle={{fontSize: "14px"}}/>
                    <Line type="monotone" dataKey="Turnover %" stroke="#3B82F6" strokeWidth={3} activeDot={{ r: 8 }} dot={{ r: 5, strokeWidth: 2, fill: '#fff' }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
