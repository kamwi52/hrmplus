import React, { useState } from 'react';
// Fix: Correct import path for types.
import type { LeaveRequest, Employee, User } from '../types';
import { Modal } from '../components/Modal';
// Fix: Correct import path for Icons component.
import { PlusIcon } from '../components/Icons';

interface LeaveRequestFormProps {
    employees: Employee[];
    onSubmit: (request: Omit<LeaveRequest, 'id' | 'status' | 'employeeName'>) => void;
    onClose: () => void;
    currentUser: User;
}

const LeaveRequestForm: React.FC<LeaveRequestFormProps> = ({ employees, onSubmit, onClose, currentUser }) => {
    const isEmployee = currentUser.role === 'Employee';
    const [formData, setFormData] = useState({
        employeeId: isEmployee ? currentUser.employeeId! : (employees[0]?.id || ''),
        leaveType: 'Annual' as LeaveRequest['leaveType'],
        startDate: '',
        endDate: '',
        reason: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {!isEmployee && (
                <div>
                    <label className="block text-sm font-medium text-gray-700">Employee</label>
                    <select name="employeeId" value={formData.employeeId} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">
                        {employees.map(e => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
                    </select>
                </div>
            )}
            <div>
                <label className="block text-sm font-medium text-gray-700">Leave Type</label>
                <select name="leaveType" value={formData.leaveType} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">
                    <option>Annual</option><option>Sick</option><option>Maternity</option><option>Unpaid</option>
                </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                    <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">End Date</label>
                    <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Reason</label>
                <textarea name="reason" value={formData.reason} onChange={handleChange} rows={3} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Submit Request</button>
            </div>
        </form>
    );
};

interface LeaveManagementPageProps {
    leaveRequests: LeaveRequest[];
    employees: Employee[];
    addLeaveRequest: (request: Omit<LeaveRequest, 'id' | 'status' | 'employeeName'>) => void;
    updateLeaveRequestStatus: (requestId: string, status: 'Approved' | 'Rejected') => void;
    currentUser: User;
}

const LeaveManagementPage: React.FC<LeaveManagementPageProps> = ({ leaveRequests, employees, addLeaveRequest, updateLeaveRequestStatus, currentUser }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isAdmin = currentUser.role === 'Admin';

    const handleFormSubmit = (request: Omit<LeaveRequest, 'id' | 'status' | 'employeeName'>) => {
        addLeaveRequest(request);
        setIsModalOpen(false);
    };

    const statusClasses = {
        Pending: 'bg-yellow-100 text-yellow-800',
        Approved: 'bg-green-100 text-green-800',
        Rejected: 'bg-red-100 text-red-800',
    };
    
    const pageTitle = isAdmin ? "Leave Management" : "My Leave Requests";

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold text-gray-800">{pageTitle}</h1>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                    <PlusIcon className="h-5 w-5 mr-2" /> New Request
                </button>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {isAdmin && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            {isAdmin && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {leaveRequests.map(req => (
                            <tr key={req.id}>
                                {isAdmin && <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{req.employeeName}</td>}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.startDate} to {req.endDate}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.leaveType}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClasses[req.status]}`}>{req.status}</span></td>
                                {isAdmin && (
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {req.status === 'Pending' && (
                                            <>
                                                <button onClick={() => updateLeaveRequestStatus(req.id, 'Approved')} className="text-green-600 hover:text-green-900 mr-4">Approve</button>
                                                <button onClick={() => updateLeaveRequestStatus(req.id, 'Rejected')} className="text-red-600 hover:text-red-900">Reject</button>
                                            </>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Leave Request">
                <LeaveRequestForm employees={employees} onSubmit={handleFormSubmit} onClose={() => setIsModalOpen(false)} currentUser={currentUser} />
            </Modal>
        </div>
    );
};

export default LeaveManagementPage;
