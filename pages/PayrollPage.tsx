import React, { useState, useMemo } from 'react';
// Fix: Correct import path for types.
import type { Employee, PayslipRecord, MasterPayrollItem } from '../types';
// Fix: Correct import path for child pages.
import MasterPayrollPage from './MasterPayrollPage';
import PaymentHistoryPage from './PaymentHistoryPage';
import PayslipPage from './PayslipPage';
import { Modal } from '../components/Modal';
// Fix: Correct import path for utility functions.
import { calculateGrossPay, calculateTotalDeductions, calculateNetPay } from '../utils/payrollCalculations';

interface PayrollPageProps {
    employees: Employee[];
    payslipRecords: PayslipRecord[];
    masterPayrollItems: MasterPayrollItem[];
    onRunPayroll: (records: PayslipRecord[]) => void;
    onAddMasterItem: (item: Omit<MasterPayrollItem, 'id'>) => void;
    onUpdateMasterItem: (item: MasterPayrollItem) => void;
    onDeleteMasterItem: (itemId: string) => void;
}

const formatCurrency = (amount: number) => {
    return `K ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const PayrollPage: React.FC<PayrollPageProps> = ({ employees, payslipRecords, masterPayrollItems, onRunPayroll, onAddMasterItem, onUpdateMasterItem, onDeleteMasterItem }) => {
    const [view, setView] = useState<'list' | 'master' | 'history' | 'payslip'>('list');
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [selectedPayslip, setSelectedPayslip] = useState<PayslipRecord | null>(null);
    const [isRunPayrollModalOpen, setIsRunPayrollModalOpen] = useState(false);
    const [payPeriod, setPayPeriod] = useState('');

    const handleViewHistory = (employee: Employee) => {
        setSelectedEmployee(employee);
        setView('history');
    };
    
    const handleViewPayslip = (record: PayslipRecord) => {
        setSelectedPayslip(record);
        setView('payslip');
    };

    const handleRunPayroll = () => {
        if (!payPeriod) {
            alert('Please enter a pay period.');
            return;
        }

        const newPayslipRecords: PayslipRecord[] = employees.map(emp => {
            const grossPay = calculateGrossPay(emp.earnings);
            const totalDeductions = calculateTotalDeductions(emp.deductions);
            const netPay = calculateNetPay(emp.earnings, emp.deductions);

            return {
                id: `ps-${emp.id}-${Date.now()}`,
                employeeId: emp.id,
                payPeriod: payPeriod,
                dateIssued: new Date().toISOString(),
                earnings: [...emp.earnings],
                deductions: [...emp.deductions],
                grossPay,
                totalDeductions,
                netPay,
                employeeSnapshot: { ...emp },
            };
        });
        
        onRunPayroll(newPayslipRecords);
        setIsRunPayrollModalOpen(false);
        setPayPeriod('');
        alert(`Payroll run for ${payPeriod} completed for ${employees.length} employees.`);
    };

    const employeePayslips = useMemo(() => {
        if (!selectedEmployee) return [];
        return payslipRecords.filter(r => r.employeeId === selectedEmployee.id);
    }, [payslipRecords, selectedEmployee]);

    if (view === 'master') {
        return <MasterPayrollPage 
            masterItems={masterPayrollItems} 
            addMasterItem={onAddMasterItem} 
            updateMasterItem={onUpdateMasterItem} 
            deleteMasterItem={onDeleteMasterItem} 
            onBack={() => setView('list')}
        />;
    }

    if (view === 'history' && selectedEmployee) {
        return <PaymentHistoryPage 
            employee={selectedEmployee}
            records={employeePayslips}
            onBack={() => { setView('list'); setSelectedEmployee(null); }}
            onViewPayslip={handleViewPayslip}
        />;
    }
    
    if (view === 'payslip' && selectedPayslip) {
        return <PayslipPage 
            payslip={selectedPayslip} 
            onBack={() => setView('history')} 
        />
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold text-gray-800">Payroll</h1>
                <div className="space-x-2">
                    <button onClick={() => setView('master')} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Master Payroll Data</button>
                    <button onClick={() => setIsRunPayrollModalOpen(true)} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Run Payroll</button>
                </div>
            </div>
            
             <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salary</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {employees.map(emp => (
                            <tr key={emp.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{emp.firstName} {emp.lastName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.position}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{formatCurrency(emp.salary)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleViewHistory(emp)} className="text-blue-600 hover:text-blue-900">View History</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isRunPayrollModalOpen} onClose={() => setIsRunPayrollModalOpen(false)} title="Run New Payroll">
                <div className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Pay Period</label>
                        <input type="text" value={payPeriod} onChange={e => setPayPeriod(e.target.value)} placeholder="e.g., July 2024" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
                    </div>
                    <p className="text-sm text-gray-600">This will generate payslips for all {employees.length} employees based on their current payroll data. This action cannot be undone.</p>
                    <div className="flex justify-end space-x-2 pt-4">
                        <button type="button" onClick={() => setIsRunPayrollModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">Cancel</button>
                        <button onClick={handleRunPayroll} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Confirm & Run</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default PayrollPage;
