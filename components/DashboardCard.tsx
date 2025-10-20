import React from 'react';

interface DashboardCardProps {
    title: string;
    icon: React.ReactNode;
    iconBgColor: string;
    onClick: () => void;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ title, icon, iconBgColor, onClick }) => {
    return (
        <div 
            className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center justify-center text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onClick()}
        >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${iconBgColor} mb-4`}>
                {icon}
            </div>
            <h3 className="font-semibold text-gray-700">{title}</h3>
        </div>
    );
};
