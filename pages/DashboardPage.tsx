import React from 'react';
import { MetricCard } from '../components/MetricCard';
import { TurnoverChart } from '../components/TurnoverChart';
import { DepartmentChart } from '../components/DepartmentChart';
// Fix: Correct import path for types.
import type { DepartmentDataPoint, User } from '../types';

interface DashboardPageProps {
    employeeCount: number;
    leaveRequestsPending: number;
    openPositions: number;
    departmentDistribution: DepartmentDataPoint[];
    user: User;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ employeeCount, leaveRequestsPending, openPositions, departmentDistribution, user }) => {
    const isAdmin = user.role === 'Admin';
    return (
        <div>
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">{isAdmin ? 'Admin Dashboard' : 'My Dashboard'}</h1>

            <div className={`grid grid-cols-1 md:grid-cols-2 ${isAdmin ? 'lg:grid-cols-3' : ''} gap-6 mb-8`}>
                {isAdmin && <MetricCard title="Total Employees" value={employeeCount.toString()} />}
                <MetricCard title="Pending Leave Requests" value={leaveRequestsPending.toString()} />
                {isAdmin && <MetricCard title="Open Positions" value={openPositions.toString()} />}
            </div>

            {isAdmin && (
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Employee Turnover</h2>
                        <TurnoverChart />
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Department Distribution</h2>
                        <DepartmentChart data={departmentDistribution} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
