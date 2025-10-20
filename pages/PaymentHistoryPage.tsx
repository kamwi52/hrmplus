import React, { useState, useMemo } from 'react';
// Fix: Correct import path for types.
import type { Employee, PayslipRecord } from '../types';

interface PaymentHistoryPageProps {
    employee: Employee;
    records: PayslipRecord[];
    onBack: () => void;
    onViewPayslip: (record: PayslipRecord) => void;
}

const formatCurrency = (amount: number) => {
    return `K ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const PaymentHistoryPage: React.FC<PaymentHistoryPageProps> = ({ employee, records, onBack, onViewPayslip }) => {
    const [payPeriodFilter, setPayPeriodFilter] = useState('');
    const [startDateFilter, setStartDateFilter] = useState('');
    const [endDateFilter, setEndDateFilter] = useState('');

    const sortedRecords = useMemo(() => 
        [...records].sort((a, b) => new Date(b.dateIssued).getTime() - new Date(a.dateIssued).getTime()),
        [records]
    );

    const filteredRecords = useMemo(() => {
        return sortedRecords.filter(record => {
            // Pay Period Filter
            if (payPeriodFilter && !record.payPeriod.toLowerCase().includes(payPeriodFilter.toLowerCase())) {
                return false;
            }
            
            // Date Range Filter
            const issueDate = new Date(record.dateIssued);
            if (startDateFilter) {
                const start = new Date(startDateFilter);
                start.setHours(0, 0, 0, 0); // Start of the day
                if (issueDate < start) return false;
            }
            if (endDateFilter) {
                const end = new Date(endDateFilter);
                end.setHours(23, 59, 59, 999); // End of the day
                if (issueDate > end) return false;
            }

            return true;
        });
    }, [sortedRecords, payPeriodFilter, startDateFilter, endDateFilter]);

    const handleClearFilters = () => {
        setPayPeriodFilter('');
        setStartDateFilter('');
        setEndDateFilter('');
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <button onClick={onBack} className="text-blue-600 hover:underline mb-2">&larr; Back to Payroll List</button>
                    <h1 className="text-3xl font-semibold text-gray-800">Payment History for {employee.firstName} {employee.lastName}</h1>
                </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border mb-6 flex flex-wrap items-end gap-4">
                <div>
                    <label htmlFor="payPeriodFilter" className="block text-sm font-medium text-gray-700">Filter by Pay Period</label>
                    <input
                        type="text"
                        id="payPeriodFilter"
                        value={payPeriodFilter}
                        onChange={(e) => setPayPeriodFilter(e.target.value)}
                        placeholder="e.g., October 2024"
                        className="mt-1 block w-full md:w-auto rounded-md border-gray-300 shadow-sm sm:text-sm"
                    />
                </div>
                 <div>
                    <label htmlFor="startDateFilter" className="block text-sm font-medium text-gray-700">Start Date</label>
                    <input
                        type="date"
                        id="startDateFilter"
                        value={startDateFilter}
                        onChange={(e) => setStartDateFilter(e.target.value)}
                        className="mt-1 block w-full md:w-auto rounded-md border-gray-300 shadow-sm sm:text-sm"
                    />
                </div>
                 <div>
                    <label htmlFor="endDateFilter" className="block text-sm font-medium text-gray-700">End Date</label>
                    <input
                        type="date"
                        id="endDateFilter"
                        value={endDateFilter}
                        onChange={(e) => setEndDateFilter(e.target.value)}
                        className="mt-1 block w-full md:w-auto rounded-md border-gray-300 shadow-sm sm:text-sm"
                    />
                </div>
                <button
                    onClick={handleClearFilters}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                    Clear Filters
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pay Period</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Issued</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Pay</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deductions</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Pay</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredRecords.map(record => (
                            <tr key={record.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.payPeriod}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(record.dateIssued).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{formatCurrency(record.grossPay)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{formatCurrency(record.totalDeductions)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono font-semibold">{formatCurrency(record.netPay)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => onViewPayslip(record)} className="text-blue-600 hover:text-blue-900">
                                        View Payslip
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredRecords.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">No payment history found for the selected filters.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentHistoryPage;
