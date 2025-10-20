import React from 'react';
// Fix: Correct import path for types.
import type { Employee } from '../types';
// Fix: Correct import path for utility functions.
import { calculateNetPay, calculateGrossPay, calculateTotalDeductions } from '../utils/payrollCalculations';

interface EmployeeProfilePageProps {
    employee: Employee;
    onBack: () => void;
}

const formatCurrency = (amount: number) => {
    return `K ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const EmployeeProfilePage: React.FC<EmployeeProfilePageProps> = ({ employee, onBack }) => {
    const grossPay = calculateGrossPay(employee.earnings);
    const totalDeductions = calculateTotalDeductions(employee.deductions);
    const netPay = grossPay - totalDeductions;
    
    return (
        <div>
            <button onClick={onBack} className="text-blue-600 hover:underline mb-4">&larr; Back to Employee List</button>
            <div className="bg-white shadow-lg rounded-lg p-8">
                <div className="flex items-center space-x-6 mb-8">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-3xl font-bold text-gray-500">
                        {employee.firstName[0]}{employee.lastName[0]}
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800">{employee.firstName} {employee.lastName}</h1>
                        <p className="text-xl text-gray-600">{employee.position}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2 mb-4">Personal Information</h2>
                        <div className="space-y-3 text-gray-600">
                            <p><strong>Employee ID:</strong> {employee.employeeId}</p>
                            <p><strong>Email:</strong> <a href={`mailto:${employee.email}`} className="text-blue-600">{employee.email}</a></p>
                            <p><strong>Department:</strong> {employee.department}</p>
                            <p><strong>Date of Joining:</strong> {new Date(employee.dateOfJoining).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2 mb-4">Payroll Information</h2>
                         <div className="space-y-3 text-gray-600">
                            <p><strong>Annual Salary:</strong> {formatCurrency(employee.salary)}</p>
                            <p><strong>Monthly Gross:</strong> {formatCurrency(grossPay)}</p>
                            <p><strong>Monthly Deductions:</strong> {formatCurrency(totalDeductions)}</p>
                            <p><strong>Monthly Net Pay:</strong> {formatCurrency(netPay)}</p>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeProfilePage;
