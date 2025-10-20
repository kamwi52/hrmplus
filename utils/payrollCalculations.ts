// Fix: Correct import path for types.
import type { PayrollItem } from '../types';

export const calculateGrossPay = (earnings: PayrollItem[]): number => {
    if (!earnings) return 0;
    return earnings.reduce((acc, item) => acc + item.amount, 0);
};

export const calculateTotalDeductions = (deductions: PayrollItem[]): number => {
    if (!deductions) return 0;
    return deductions.reduce((acc, item) => acc + item.amount, 0);
};

export const calculateNetPay = (earnings: PayrollItem[], deductions: PayrollItem[]): number => {
    return calculateGrossPay(earnings) - calculateTotalDeductions(deductions);
};
