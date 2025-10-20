export type Department = 'Engineering' | 'Marketing' | 'Sales' | 'HR' | 'Design';

export interface User {
    id: string;
    username: string;
    role: 'Admin' | 'Employee';
    employeeId?: string; // Link to employee for Employee role
}

export interface PayrollItem {
    id: string;
    description: string;
    amount: number;
}

export interface Employee {
    id: string;
    employeeId: string;
    firstName: string;
    lastName: string;
    email: string;
    department: Department;
    position: string;
    dateOfJoining: string; // ISO string
    salary: number; // Annual salary
    earnings: PayrollItem[];
    deductions: PayrollItem[];
}

export interface TurnoverDataPoint {
    name: string; // Month
    'Turnover %': number;
}

export interface DepartmentDataPoint {
    name: Department;
    value: number; // Number of employees
}

export interface LeaveRequest {
    id: string;
    employeeId: string;
    employeeName: string;
    leaveType: 'Annual' | 'Sick' | 'Maternity' | 'Unpaid';
    startDate: string; // ISO string
    endDate: string; // ISO string
    reason: string;
    status: 'Pending' | 'Approved' | 'Rejected';
}

export interface JobPosition {
    id: string;
    title: string;
    department: Department;
    status: 'Open' | 'Closed';
}

export interface Candidate {
    id: string;
    jobId: string;
    firstName: string;
    lastName: string;
    email: string;
    status: 'Applied' | 'Interviewing' | 'Offered' | 'Hired' | 'Rejected';
}

export interface PayslipRecord {
    id: string;
    employeeId: string;
    payPeriod: string; // e.g., "July 2024"
    dateIssued: string; // ISO string
    earnings: PayrollItem[];
    deductions: PayrollItem[];
    grossPay: number;
    totalDeductions: number;
    netPay: number;
    employeeSnapshot: Employee;
}

export interface MasterPayrollItem {
    id: string;
    code: string;
    description: string;
    type: 'Earning' | 'Deduction';
    period: string;
}

export interface AttendanceRecord {
    id: string;
    employeeId: string;
    employeeName: string;
    date: string; // YYYY-MM-DD
    clockIn: string; // ISO string
    clockOut?: string; // ISO string
}
