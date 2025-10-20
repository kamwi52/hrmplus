import React from 'react';
import type { User } from '../types';

interface HeaderProps {
    currentPageLabel: string;
    user: User | null;
    onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPageLabel, user, onLogout }) => {
    return (
        <header className="h-20 bg-white shadow-sm flex items-center justify-between px-8 flex-shrink-0 border-b">
            <h1 className="text-2xl font-semibold text-gray-700">{currentPageLabel}</h1>
            {user && (
                <div className="flex items-center space-x-4">
                    <div>
                        <div className="font-semibold text-gray-800 text-right">{user.username}</div>
                        <div className="text-sm text-gray-500 text-right">{user.role}</div>
                    </div>
                    <button 
                        onClick={onLogout}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                        Logout
                    </button>
                </div>
            )}
        </header>
    );
};
