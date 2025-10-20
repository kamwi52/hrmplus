import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import DashboardPage from './pages/DashboardPage';
import EmployeeListPage from './pages/EmployeeListPage';
import LeaveManagementPage from './pages/LeaveManagementPage';
import RecruitmentPage from './pages/RecruitmentPage';
import PayrollPage from './pages/PayrollPage';
import TimeAttendancePage from './pages/TimeAttendancePage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import EmployeeProfilePage from './pages/EmployeeProfilePage';

import { useLocalStorageState } from './hooks/useLocalStorageState';
import { USERS, EMPLOYEES, LEAVE_REQUESTS, JOB_POSITIONS, CANDIDATES, PAYSLIP_RECORDS, MASTER_PAYROLL_ITEMS, ATTENDANCE_RECORDS } from './data';
import type { User, Employee, LeaveRequest, Department, JobPosition, Candidate, PayslipRecord, MasterPayrollItem, AttendanceRecord } from './types';

const App: React.FC = () => {
    // Authentication State
    const [currentUser, setCurrentUser] = useLocalStorageState<User | null>('currentUser', null);

    // Data State
    const [employees, setEmployees] = useLocalStorageState<Employee[]>('employees', EMPLOYEES);
    const [leaveRequests, setLeaveRequests] = useLocalStorageState<LeaveRequest[]>('leaveRequests', LEAVE_REQUESTS);
    const [jobPositions, setJobPositions] = useLocalStorageState<JobPosition[]>('jobPositions', JOB_POSITIONS);
    const [candidates, setCandidates] = useLocalStorageState<Candidate[]>('candidates', CANDIDATES);
    const [payslipRecords, setPayslipRecords] = useLocalStorageState<PayslipRecord[]>('payslipRecords', PAYSLIP_RECORDS);
    const [masterPayrollItems, setMasterPayrollItems] = useLocalStorageState<MasterPayrollItem[]>('masterPayrollItems', MASTER_PAYROLL_ITEMS);
    const [attendanceRecords, setAttendanceRecords] = useLocalStorageState<AttendanceRecord[]>('attendanceRecords', ATTENDANCE_RECORDS);
    const [users, setUsers] = useLocalStorageState<User[]>('users', USERS);

    // Navigation State
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);

    const handleLogin = (user: User) => {
        setCurrentUser(user);
        setCurrentPage('dashboard');
    };
    const handleLogout = () => {
        setCurrentUser(null);
    };

    // Derived Data for Dashboard
    const departmentDistribution = useMemo(() => {
        const counts = employees.reduce((acc, emp) => {
            acc[emp.department] = (acc[emp.department] || 0) + 1;
            return acc;
        }, {} as Record<Department, number>);
        return Object.entries(counts).map(([name, value]) => ({ name: name as Department, value }));
    }, [employees]);

    const employeeFilteredLeaveRequests = useMemo(() => {
        if (!currentUser || currentUser.role === 'Admin') return leaveRequests;
        return leaveRequests.filter(req => req.employeeId === currentUser.employeeId);
    }, [leaveRequests, currentUser]);

    // Data mutation functions
    const addEmployee = (employee: Omit<Employee, 'id'>) => {
        const newEmployee = { ...employee, id: `emp-${Date.now()}` };
        setEmployees([...employees, newEmployee]);
    };
    const updateEmployee = (updatedEmployee: Employee) => {
        setEmployees(employees.map(e => e.id === updatedEmployee.id ? updatedEmployee : e));
    };
    
    const addLeaveRequest = (request: Omit<LeaveRequest, 'id' | 'status' | 'employeeName'>) => {
        const employee = employees.find(e => e.id === request.employeeId);
        const newRequest = { 
            ...request, 
            id: `lr-${Date.now()}`, 
            status: 'Pending' as const,
            employeeName: employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown'
        };
        setLeaveRequests([...leaveRequests, newRequest]);
    };
    const updateLeaveRequestStatus = (requestId: string, status: 'Approved' | 'Rejected') => {
        setLeaveRequests(leaveRequests.map(r => r.id === requestId ? { ...r, status } : r));
    };

    const addJobPosition = (position: Omit<JobPosition, 'id'>) => {
        setJobPositions([...jobPositions, { ...position, id: `jp-${Date.now()}` }]);
    };
    const updateJobPosition = (updatedPosition: JobPosition) => {
        setJobPositions(jobPositions.map(jp => jp.id === updatedPosition.id ? updatedPosition : jp));
    };

    const addCandidate = (candidate: Omit<Candidate, 'id'>) => {
        setCandidates([...candidates, { ...candidate, id: `can-${Date.now()}`}]);
    };
    const updateCandidate = (updatedCandidate: Candidate) => {
        setCandidates(candidates.map(c => c.id === updatedCandidate.id ? updatedCandidate : c));
    };
    
    const onRunPayroll = (records: PayslipRecord[]) => {
        setPayslipRecords(prev => [...prev, ...records]);
    };
    const onAddMasterItem = (item: Omit<MasterPayrollItem, 'id'>) => {
        setMasterPayrollItems(prev => [...prev, { ...item, id: `mpi-${Date.now()}` }]);
    };
    const onUpdateMasterItem = (updatedItem: MasterPayrollItem) => {
        setMasterPayrollItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    };
    const onDeleteMasterItem = (itemId: string) => {
        setMasterPayrollItems(prev => prev.filter(item => item.id !== itemId));
    };

    const handleClockIn = (employeeId: string) => {
        const employee = employees.find(e => e.id === employeeId);
        if (!employee) return;
        
        const existingRecord = attendanceRecords.find(r => r.employeeId === employeeId && !r.clockOut && r.date === new Date().toISOString().slice(0, 10));
        if (existingRecord) {
            alert(`${employee.firstName} is already clocked in.`);
            return;
        }

        const newRecord: AttendanceRecord = {
            id: `att-${Date.now()}`,
            employeeId,
            employeeName: `${employee.firstName} ${employee.lastName}`,
            date: new Date().toISOString().slice(0, 10),
            clockIn: new Date().toISOString(),
        };
        setAttendanceRecords(prev => [...prev, newRecord]);
    };

    const handleClockOut = (employeeId: string) => {
        const recordToClockOut = attendanceRecords.find(r => r.employeeId === employeeId && !r.clockOut);
        if (!recordToClockOut) {
            const employee = employees.find(e => e.id === employeeId);
            alert(`${employee?.firstName || 'Employee'} is not clocked in.`);
            return;
        }
        setAttendanceRecords(prev => prev.map(r => r.id === recordToClockOut.id ? { ...r, clockOut: new Date().toISOString() } : r));
    };
    
    const handleUserUpdate = (updatedUser: User) => {
        setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
        if (currentUser?.id === updatedUser.id) {
            setCurrentUser(updatedUser);
        }
    };

    const handleViewProfile = (employee: Employee) => {
        setViewingEmployee(employee);
        setCurrentPage('employees'); // Keep sidebar on employees
    };

    const handleBackToList = () => {
        setViewingEmployee(null);
        setCurrentPage('employees');
    };
    
    // Page Rendering Logic
    const renderPage = () => {
        if (viewingEmployee) {
            return <EmployeeProfilePage employee={viewingEmployee} onBack={handleBackToList} />;
        }
        switch (currentPage) {
            case 'dashboard':
                return <DashboardPage user={currentUser!} employeeCount={employees.length} leaveRequestsPending={leaveRequests.filter(r => r.status === 'Pending').length} openPositions={jobPositions.filter(jp => jp.status === 'Open').length} departmentDistribution={departmentDistribution} />;
            case 'employees':
                return <EmployeeListPage employees={employees} addEmployee={addEmployee} updateEmployee={updateEmployee} onViewProfile={handleViewProfile} />;
            case 'leave':
                return <LeaveManagementPage leaveRequests={employeeFilteredLeaveRequests} employees={employees} addLeaveRequest={addLeaveRequest} updateLeaveRequestStatus={updateLeaveRequestStatus} currentUser={currentUser!} />;
            case 'recruitment':
                return <RecruitmentPage jobPositions={jobPositions} candidates={candidates} addJobPosition={addJobPosition} updateJobPosition={updateJobPosition} addCandidate={addCandidate} updateCandidate={updateCandidate} />;
            case 'payroll':
                return <PayrollPage employees={employees} payslipRecords={payslipRecords} masterPayrollItems={masterPayrollItems} onRunPayroll={onRunPayroll} onAddMasterItem={onAddMasterItem} onUpdateMasterItem={onUpdateMasterItem} onDeleteMasterItem={onDeleteMasterItem} />;
            case 'attendance':
                return <TimeAttendancePage employees={employees} attendanceRecords={attendanceRecords} onClockIn={handleClockIn} onClockOut={handleClockOut} />;
            case 'reports':
                return <ReportsPage employees={employees} payslipRecords={payslipRecords} leaveRequests={leaveRequests} />;
            case 'settings':
                return <SettingsPage user={currentUser!} onUserUpdate={handleUserUpdate} />;
            default:
                return <DashboardPage user={currentUser!} employeeCount={employees.length} leaveRequestsPending={leaveRequests.filter(r => r.status === 'Pending').length} openPositions={jobPositions.filter(jp => jp.status === 'Open').length} departmentDistribution={departmentDistribution} />;
        }
    };
    
    const navItems = [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'employees', label: 'Employees' },
        { id: 'leave', label: 'Leave' },
        { id: 'recruitment', label: 'Recruitment' },
        { id: 'payroll', label: 'Payroll' },
        { id: 'attendance', label: 'Time & Attendance' },
        { id: 'reports', label: 'Reports' },
        { id: 'settings', label: 'Settings' },
    ];
    
    if (!currentUser) {
        return <LoginPage onLogin={handleLogin} users={users} />;
    }

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} userRole={currentUser.role} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header currentPageLabel={navItems.find(n => n.id === currentPage)?.label || 'Dashboard'} user={currentUser} onLogout={handleLogout} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-8">
                    {renderPage()}
                </main>
            </div>
        </div>
    );
};

export default App;
