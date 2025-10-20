import React, { useMemo, useState } from 'react';
// Fix: Correct import path for types.
import type { Employee, PayslipRecord, LeaveRequest } from '../types';
import { exportToCSV } from '../utils/export';
// Fix: Correct import path for Icons component.
import { ChartBarIcon } from '../components/Icons';

// A generic report card component
interface ReportCardProps {
    title: string;
    description: string;
    children?: React.ReactNode; // For filters
    onExport: () => void;
}
const ReportCard: React.FC<ReportCardProps> = ({ title, description, children, onExport }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col">
        <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
            <p className="text-gray-600 mt-2 mb-4">{description}</p>
        </div>
        {children}
        <div className="mt-4">
            <button onClick={onExport} className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">
                <ChartBarIcon className="h-5 w-5 mr-2" />
                Export as CSV
            </button>
        </div>
    </div>
);

const formatCurrency = (amount: number) => {
    return `K ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const ReportsPage: React.FC<{ employees: Employee[]; payslipRecords: PayslipRecord[]; leaveRequests: LeaveRequest[] }> = ({ employees, payslipRecords, leaveRequests }) => {
    
    // State for payroll report filter
    const uniquePayPeriods = useMemo(() => [...new Set(payslipRecords.map(p => p.payPeriod))].sort((a,b) => new Date(b).getTime() - new Date(a).getTime()), [payslipRecords]);
    const [selectedPayPeriod, setSelectedPayPeriod] = useState(uniquePayPeriods[0] || '');

    // State for leave report filters
    const [leaveStartDate, setLeaveStartDate] = useState('');
    const [leaveEndDate, setLeaveEndDate] = useState('');

    const payrollReportData = useMemo(() => 
        payslipRecords
            .filter(p => !selectedPayPeriod || p.payPeriod === selectedPayPeriod)
            .map(p => ({
                "Pay Period": p.payPeriod,
                "Employee Name": `${p.employeeSnapshot.firstName} ${p.employeeSnapshot.lastName}`,
                "Gross Pay": p.grossPay.toFixed(2),
                "Deductions": p.totalDeductions.toFixed(2),
                "Net Pay": p.netPay.toFixed(2),
                "Date Issued": new Date(p.dateIssued).toLocaleDateString()
            })), 
    [payslipRecords, selectedPayPeriod]);
    
    const payrollTotals = useMemo(() => {
        const relevantRecords = payslipRecords.filter(p => !selectedPayPeriod || p.payPeriod === selectedPayPeriod);
        return relevantRecords.reduce((acc, record) => {
            acc.gross += record.grossPay;
            acc.deductions += record.totalDeductions;
            acc.net += record.netPay;
            return acc;
        }, { gross: 0, deductions: 0, net: 0 });
    }, [payslipRecords, selectedPayPeriod]);

    const leaveReportData = useMemo(() => 
        leaveRequests
            .filter(req => {
                const reqDate = new Date(req.startDate);
                if (leaveStartDate && reqDate < new Date(leaveStartDate)) return false;
                if (leaveEndDate && reqDate > new Date(leaveEndDate)) return false;
                return true;
            })
            .map(req => ({
                "Employee Name": req.employeeName,
                "Leave Type": req.leaveType,
                "Start Date": req.startDate,
                "End Date": req.endDate,
                "Status": req.status,
            })), 
    [leaveRequests, leaveStartDate, leaveEndDate]);

    return (
        <div>
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Reports</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ReportCard 
                    title="Payroll Summary"
                    description="Download a summary of a completed payroll run."
                    onExport={() => exportToCSV(payrollReportData, `payroll-summary-${selectedPayPeriod}`)}
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Select Pay Period</label>
                            <select value={selectedPayPeriod} onChange={e => setSelectedPayPeriod(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">
                                {uniquePayPeriods.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border">
                             <h3 className="text-md font-semibold text-gray-800 mb-3">Expenditure Insights</h3>
                             <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Gross Pay (Wage Bill):</span>
                                    <span className="font-mono font-semibold text-gray-800">{formatCurrency(payrollTotals.gross)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Deductions:</span>
                                    <span className="font-mono font-semibold text-gray-800">{formatCurrency(payrollTotals.deductions)}</span>
                                </div>
                                <div className="flex justify-between border-t pt-2 mt-2">
                                    <span className="font-bold text-gray-700">Total Net Pay (Paid Out):</span>
                                    <span className="font-mono font-bold text-gray-900">{formatCurrency(payrollTotals.net)}</span>
                                </div>
                             </div>
                        </div>
                    </div>
                </ReportCard>
                
                 <ReportCard 
                    title="Leave Balance"
                    description="Download a list of leave requests within a specific date range."
                    onExport={() => exportToCSV(leaveReportData, `leave-balance-${leaveStartDate}-to-${leaveEndDate}`)}
                >
                    <div className="grid grid-cols-2 gap-4 mt-auto">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Start Date</label>
                            <input type="date" value={leaveStartDate} onChange={e => setLeaveStartDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">End Date</label>
                            <input type="date" value={leaveEndDate} onChange={e => setLeaveEndDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"/>
                        </div>
                    </div>
                </ReportCard>
            </div>
        </div>
    );
};

export default ReportsPage;
