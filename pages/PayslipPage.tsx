import React from 'react';
// Fix: Correct import path for types.
import type { PayslipRecord, PayrollItem } from '../types';

interface PayslipPageProps {
    payslip: PayslipRecord;
    onBack: () => void;
}

const formatCurrency = (amount: number) => {
    return `K ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const PayrollItemsTable: React.FC<{ items: PayrollItem[], title: string }> = ({ items, title }) => (
    <div>
        <h3 className="text-lg font-semibold text-black mb-2">{title}</h3>
        <table className="w-full text-sm">
            <thead>
                <tr className="border-b">
                    <th className="text-left font-medium py-2 text-black">Description</th>
                    <th className="text-right font-medium py-2 text-black">Amount</th>
                </tr>
            </thead>
            <tbody>
                {items.map(item => (
                    <tr key={item.id} className="border-b border-gray-100">
                        <td className="py-2 text-black">{item.description}</td>
                        <td className="py-2 text-right font-mono text-black">{formatCurrency(item.amount)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const PayslipPage: React.FC<PayslipPageProps> = ({ payslip, onBack }) => {
    const { employeeSnapshot: employee } = payslip;

    return (
        <div>
            <button onClick={onBack} className="text-blue-600 hover:underline mb-4">&larr; Back to Payment History</button>
             <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl mx-auto" id="payslip-to-print">
                <header className="flex justify-between items-center border-b pb-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-black">NARTY ROCK FOUNDATION SCHOOL</h1>
                        <p className="text-black">For Pay Period: {payslip.payPeriod}</p>
                    </div>
                </header>

                <section className="grid grid-cols-2 gap-8 mb-6">
                    <div>
                        <h3 className="font-semibold text-black mb-2">Employee Details</h3>
                        <div className="text-sm space-y-1 text-black">
                            <p><strong>Name:</strong> {employee.firstName} {employee.lastName}</p>
                            <p><strong>Employee ID:</strong> {employee.employeeId}</p>
                            <p><strong>Position:</strong> {employee.position}</p>
                            <p><strong>Department:</strong> {employee.department}</p>
                        </div>
                    </div>
                     <div className="text-right">
                        <h3 className="font-semibold text-black mb-2">Payment Details</h3>
                         <div className="text-sm space-y-1 text-black">
                            <p><strong>Pay Period:</strong> {payslip.payPeriod}</p>
                            <p><strong>Date Issued:</strong> {new Date(payslip.dateIssued).toLocaleDateString()}</p>
                            <p><strong>Payslip ID:</strong> {payslip.id}</p>
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-2 gap-8 mb-6">
                    <PayrollItemsTable items={payslip.earnings} title="Earnings" />
                    <PayrollItemsTable items={payslip.deductions} title="Deductions" />
                </section>

                <footer className="border-t pt-4 mt-6">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="bg-gray-50 p-3 rounded-md">
                            <p className="font-medium text-black">Gross Pay</p>
                            <p className="text-lg font-semibold font-mono text-black">{formatCurrency(payslip.grossPay)}</p>
                        </div>
                         <div className="bg-gray-50 p-3 rounded-md">
                            <p className="font-medium text-black">Total Deductions</p>
                            <p className="text-lg font-semibold font-mono text-black">{formatCurrency(payslip.totalDeductions)}</p>
                        </div>
                         <div className="bg-blue-50 p-3 rounded-md">
                            <p className="font-medium text-black">Net Pay</p>
                            <p className="text-xl font-bold font-mono text-black">{formatCurrency(payslip.netPay)}</p>
                        </div>
                    </div>
                </footer>
            </div>
             <div className="text-center mt-6">
                <button onClick={() => window.print()} className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                    Print Payslip
                </button>
            </div>
        </div>
    );
};

export default PayslipPage;
