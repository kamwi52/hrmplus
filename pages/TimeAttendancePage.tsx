import React, { useState, useMemo } from 'react';
// Fix: Correct import path for types.
import type { Employee, AttendanceRecord } from '../types';

interface TimeAttendancePageProps {
    employees: Employee[];
    attendanceRecords: AttendanceRecord[];
    onClockIn: (employeeId: string) => void;
    onClockOut: (employeeId: string) => void;
}

const TimeAttendancePage: React.FC<TimeAttendancePageProps> = ({ employees, attendanceRecords, onClockIn, onClockOut }) => {
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(employees[0]?.id || '');

    const todayRecords = useMemo(() => {
        const today = new Date().toISOString().slice(0, 10);
        return attendanceRecords.filter(r => r.date === today).sort((a,b) => new Date(b.clockIn).getTime() - new Date(a.clockIn).getTime());
    }, [attendanceRecords]);
    
    const calculateDuration = (clockIn: string, clockOut?: string): string => {
        if (!clockOut) return 'In Progress';
        const start = new Date(clockIn).getTime();
        const end = new Date(clockOut).getTime();
        const diffMs = end - start;
        const hours = Math.floor(diffMs / 3600000);
        const minutes = Math.floor((diffMs % 3600000) / 60000);
        return `${hours}h ${minutes}m`;
    };

    return (
        <div>
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Time & Attendance</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Clock In/Out Panel */}
                <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Clock In / Out</h2>
                    <div className="space-y-4">
                        <div>
                             <label className="block text-sm font-medium text-gray-700">Select Employee</label>
                             <select 
                                value={selectedEmployeeId} 
                                onChange={e => setSelectedEmployeeId(e.target.value)} 
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                {employees.map(emp => (
                                    <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                                ))}
                             </select>
                        </div>
                        <div className="flex space-x-2">
                             <button 
                                onClick={() => onClockIn(selectedEmployeeId)}
                                className="w-full flex-1 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                            >
                                Clock In
                            </button>
                            <button 
                                onClick={() => onClockOut(selectedEmployeeId)}
                                className="w-full flex-1 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                            >
                                Clock Out
                            </button>
                        </div>
                    </div>
                </div>

                {/* Attendance Log */}
                 <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Today's Attendance Log</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clock In</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clock Out</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {todayRecords.map(record => (
                                     <tr key={record.id}>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.employeeName}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(record.clockIn).toLocaleTimeString()}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{record.clockOut ? new Date(record.clockOut).toLocaleTimeString() : '-'}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{calculateDuration(record.clockIn, record.clockOut)}</td>
                                     </tr>
                                ))}
                                {todayRecords.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-4 text-center text-sm text-gray-500">No attendance records for today.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default TimeAttendancePage;
