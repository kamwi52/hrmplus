
import React from 'react';

interface MetricCardProps {
    title: string;
    value: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h4 className="text-gray-500 text-sm font-medium">{title}</h4>
            <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
        </div>
    );
};
