import React from 'react';
// Fix: Correct import path for Icons component.
import { HomeIcon, UserGroupIcon, CalendarDaysIcon, BriefcaseIcon, BanknotesIcon, DocumentChartBarIcon, ClockIcon, Cog6ToothIcon } from './Icons';

type NavItemProps = {
    icon: React.ReactNode;
    label: string;
    active: boolean;
    onClick: () => void;
};

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center py-3 px-4 text-left transition-colors duration-200 rounded-r-full mr-4 ${
            active
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
        }`}
    >
        {icon}
        <span className="ml-4 font-medium">{label}</span>
    </button>
);

interface SidebarProps {
    currentPage: string;
    setCurrentPage: (page: string) => void;
    userRole: 'Admin' | 'Employee';
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, userRole }) => {
    const adminNavs = [
        { id: 'dashboard', label: 'Dashboard', icon: <HomeIcon className="w-6 h-6" /> },
        { id: 'employees', label: 'Employees', icon: <UserGroupIcon className="w-6 h-6" /> },
        { id: 'leave', label: 'Leave Management', icon: <CalendarDaysIcon className="w-6 h-6" /> },
        { id: 'recruitment', label: 'Recruitment', icon: <BriefcaseIcon className="w-6 h-6" /> },
        { id: 'payroll', label: 'Payroll', icon: <BanknotesIcon className="w-6 h-6" /> },
        { id: 'attendance', label: 'Time & Attendance', icon: <ClockIcon className="w-6 h-6" /> },
        { id: 'reports', label: 'Reports', icon: <DocumentChartBarIcon className="w-6 h-6" /> },
        { id: 'settings', label: 'Settings', icon: <Cog6ToothIcon className="w-6 h-6" /> },
    ];
    
    const employeeNavs = [
        { id: 'dashboard', label: 'My Dashboard', icon: <HomeIcon className="w-6 h-6" /> },
        { id: 'leave', label: 'My Leave', icon: <CalendarDaysIcon className="w-6 h-6" /> },
        { id: 'settings', label: 'Settings', icon: <Cog6ToothIcon className="w-6 h-6" /> },
    ];

    const navItems = userRole === 'Admin' ? adminNavs : employeeNavs;

    return (
        <aside className="w-64 bg-white shadow-md flex-shrink-0 flex flex-col">
            <div className="h-20 flex items-center justify-center border-b">
                <HomeIcon className="w-8 h-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-800 ml-2">HRMS</h1>
            </div>
            <nav className="flex-1 py-4">
                <ul>
                    {navItems.map(item => (
                         <li key={item.id}>
                             <NavItem
                                 icon={item.icon}
                                 label={item.label}
                                 active={currentPage === item.id}
                                 onClick={() => setCurrentPage(item.id)}
                            />
                         </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};
