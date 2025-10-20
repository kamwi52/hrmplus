import type { Employee, User, LeaveRequest, JobPosition, Candidate, PayslipRecord, MasterPayrollItem, AttendanceRecord } from './types';

export const USERS: User[] = [
    { id: 'user-1', username: 'Admin User', role: 'Admin' },
    { id: 'user-2', username: 'Jane Doe', role: 'Employee', employeeId: 'emp-2' },
];

export const EMPLOYEES: Employee[] = [
    {
        id: 'emp-1',
        employeeId: 'EMP001',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@example.com',
        department: 'Engineering',
        position: 'Senior Developer',
        dateOfJoining: '2022-01-15T00:00:00.000Z',
        salary: 90000,
        earnings: [{ id: 'earn-1', description: 'Base Salary', amount: 7500 }],
        deductions: [{ id: 'deduct-1', description: 'Tax', amount: 1500 }, { id: 'deduct-2', description: 'Pension', amount: 500 }],
    },
    {
        id: 'emp-2',
        employeeId: 'EMP002',
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        department: 'Marketing',
        position: 'Marketing Manager',
        dateOfJoining: '2021-03-20T00:00:00.000Z',
        salary: 80000,
        earnings: [{ id: 'earn-2', description: 'Base Salary', amount: 6666.67 }],
        deductions: [{ id: 'deduct-3', description: 'Tax', amount: 1200 }, { id: 'deduct-4', description: 'Pension', amount: 400 }],
    },
     {
        id: 'emp-3',
        employeeId: 'EMP003',
        firstName: 'Peter',
        lastName: 'Jones',
        email: 'peter.jones@example.com',
        department: 'Sales',
        position: 'Sales Executive',
        dateOfJoining: '2023-05-10T00:00:00.000Z',
        salary: 65000,
        earnings: [{ id: 'earn-3', description: 'Base Salary', amount: 5416.67 }],
        deductions: [{ id: 'deduct-5', description: 'Tax', amount: 900 }, { id: 'deduct-6', description: 'Pension', amount: 300 }],
    },
];

export const LEAVE_REQUESTS: LeaveRequest[] = [
    { id: 'lr-1', employeeId: 'emp-1', employeeName: 'John Smith', leaveType: 'Annual', startDate: '2024-08-01', endDate: '2024-08-05', reason: 'Vacation', status: 'Approved' },
    { id: 'lr-2', employeeId: 'emp-2', employeeName: 'Jane Doe', leaveType: 'Sick', startDate: '2024-07-20', endDate: '2024-07-21', reason: 'Flu', status: 'Approved' },
    { id: 'lr-3', employeeId: 'emp-2', employeeName: 'Jane Doe', leaveType: 'Annual', startDate: '2024-09-10', endDate: '2024-09-15', reason: 'Family trip', status: 'Pending' },
];

export const JOB_POSITIONS: JobPosition[] = [
    { id: 'jp-1', title: 'Frontend Developer', department: 'Engineering', status: 'Open' },
    { id: 'jp-2', title: 'Product Designer', department: 'Design', status: 'Open' },
    { id: 'jp-3', title: 'HR Generalist', department: 'HR', status: 'Closed' },
];

export const CANDIDATES: Candidate[] = [
    { id: 'can-1', jobId: 'jp-1', firstName: 'Alice', lastName: 'Williams', email: 'alice.w@example.com', status: 'Interviewing' },
    { id: 'can-2', jobId: 'jp-1', firstName: 'Bob', lastName: 'Brown', email: 'bob.b@example.com', status: 'Applied' },
    { id: 'can-3', jobId: 'jp-2', firstName: 'Charlie', lastName: 'Davis', email: 'charlie.d@example.com', status: 'Offered' },
];

export const PAYSLIP_RECORDS: PayslipRecord[] = [];
export const MASTER_PAYROLL_ITEMS: MasterPayrollItem[] = [
    { id: 'mpi-1', code: '001', description: 'Base Salary', type: 'Earning', period: '999' },
    { id: 'mpi-2', code: '002', description: 'Overtime', type: 'Earning', period: '999' },
    { id: 'mpi-3', code: '101', description: 'Tax (PAYE)', type: 'Deduction', period: '999' },
    { id: 'mpi-4', code: '102', description: 'Pension Contribution', type: 'Deduction', period: '999' },
];

export const ATTENDANCE_RECORDS: AttendanceRecord[] = [];
