import React, { useState } from 'react';
// Fix: Correct import path for types.
import type { User } from '../types';

interface SettingsPageProps {
    user: User;
    onUserUpdate: (updatedUser: User) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ user, onUserUpdate }) => {
    const [username, setUsername] = useState(user.username);
    // Add more settings state as needed, e.g., password change fields

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you'd add validation and more logic here
        onUserUpdate({ ...user, username });
        alert('Settings updated!');
    };

    return (
        <div>
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Settings</h1>
            <div className="bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Profile Information</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                            />
                        </div>
                         <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Role</label>
                            <p className="mt-1 text-sm text-gray-500 bg-gray-100 p-2 rounded-md">{user.role}</p>
                        </div>
                    </div>

                    {/* Add more sections like "Change Password" here */}

                    <div className="flex justify-end pt-4">
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SettingsPage;
