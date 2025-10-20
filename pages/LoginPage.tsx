import React, { useState } from 'react';
// Fix: Correct import path for Icons component.
import { HomeIcon } from '../components/Icons';
// Fix: Correct import path for types.
import type { User } from '../types';

interface LoginPageProps {
    onLogin: (user: User) => void;
    users: User[];
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, users }) => {
    const [selectedUserId, setSelectedUserId] = useState(users[0]?.id || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const user = users.find(u => u.id === selectedUserId);
        if (user) {
            onLogin(user);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-sm p-8 space-y-8 bg-white rounded-lg shadow-lg">
                <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                        <HomeIcon className="w-10 h-10 text-blue-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-center text-gray-900">HRMS Login</h2>
                    <p className="mt-2 text-sm text-center text-gray-600">Select a user to sign in</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="user-select" className="block text-sm font-medium text-gray-700">Select User Role</label>
                        <select
                            id="user-select"
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                            className="mt-1 relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            {users.map(user => (
                                <option key={user.id} value={user.id}>{user.username} ({user.role})</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md group hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
