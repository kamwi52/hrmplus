import React, { useState, useMemo } from 'react';
// Fix: Correct import path for types.
import type { Employee, Department } from '../types';
import { Modal } from '../components/Modal';
// Fix: Correct import path for Icons component.
import { PlusIcon, PencilIcon } from '../components/Icons';

interface EmployeeFormProps {
    onSubmit: (employee: Omit<Employee, 'id'> | Employee) => void;
    onClose: () => void;
    employeeToEdit?: Employee | null;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ onSubmit, onClose, employeeToEdit }) => {
    const [formData, setFormData] = useState({
        employeeId: employeeToEdit?.employeeId || '',
        firstName: employeeToEdit?.firstName || '',
        lastName: employeeToEdit?.lastName || '',
        email: employeeToEdit?.email || '',
        department: employeeToEdit?.department || 'Engineering' as Department,
        position: employeeToEdit?.position || '',
        dateOfJoining: employeeToEdit?.dateOfJoining ? new Date(employeeToEdit.dateOfJoining).toISOString().split('T')[0] : '',
        salary: employeeToEdit?.salary || 0,
        earnings: employeeToEdit?.earnings || [],
        deductions: employeeToEdit?.deductions || [],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'salary' ? parseFloat(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const employeeData = employeeToEdit ? { ...employeeToEdit, ...formData, dateOfJoining: new Date(formData.dateOfJoining).toISOString() } : { ...formData, dateOfJoining: new Date(formData.dateOfJoining).toISOString() };
        onSubmit(employeeData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700">Employee ID</label><input type="text" name="employeeId" value={formData.employeeId} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-700">Joining Date</label><input type="date" name="dateOfJoining" value={formData.dateOfJoining} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-700">First Name</label><input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-700">Last Name</label><input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" /></div>
            </div>
            <div><label className="block text-sm font-medium text-gray-700">Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" /></div>
            <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700">Department</label><select name="department" value={formData.department} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"><option>Engineering</option><option>Marketing</option><option>Sales</option><option>HR</option><option>Design</option></select></div>
                <div><label className="block text-sm font-medium text-gray-700">Position</label><input type="text" name="position" value={formData.position} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" /></div>
            </div>
             <div><label className="block text-sm font-medium text-gray-700">Salary</label><input type="number" name="salary" value={formData.salary} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" /></div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">{employeeToEdit ? 'Save Changes' : 'Add Employee'}</button>
            </div>
        </form>
    );
};

interface EmployeeListPageProps {
    employees: Employee[];
    addEmployee: (employee: Omit<Employee, 'id'>) => void;
    updateEmployee: (employee: Employee) => void;
    onViewProfile: (employee: Employee) => void;
}

const EmployeeListPage: React.FC<EmployeeListPageProps> = ({ employees, addEmployee, updateEmployee, onViewProfile }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const openAddModal = () => { setEmployeeToEdit(null); setIsModalOpen(true); };
    const openEditModal = (employee: Employee) => { setEmployeeToEdit(employee); setIsModalOpen(true); };
    const closeModal = () => { setIsModalOpen(false); setEmployeeToEdit(null); };

    const handleFormSubmit = (employeeData: Omit<Employee, 'id'> | Employee) => {
        if ('id' in employeeData) {
            updateEmployee(employeeData);
        } else {
            addEmployee(employeeData);
        }
        closeModal();
    };

    const filteredEmployees = useMemo(() =>
        employees.filter(emp =>
            `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.position.toLowerCase().includes(searchTerm.toLowerCase())
        ), [employees, searchTerm]
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold text-gray-800">Employees</h1>
                <button onClick={openAddModal} className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                    <PlusIcon className="h-5 w-5 mr-2" /> New Employee
                </button>
            </div>
            <div className="mb-4">
                <input type="text" placeholder="Search employees..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredEmployees.map(emp => (
                            <tr key={emp.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{emp.firstName} {emp.lastName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.position}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.department}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => onViewProfile(emp)} className="text-blue-600 hover:text-blue-900 mr-4">View</button>
                                    <button onClick={() => openEditModal(emp)} className="text-indigo-600 hover:text-indigo-900"><PencilIcon className="h-5 w-5"/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal} title={employeeToEdit ? 'Edit Employee' : 'Add New Employee'}>
                <EmployeeForm onSubmit={handleFormSubmit} onClose={closeModal} employeeToEdit={employeeToEdit} />
            </Modal>
        </div>
    );
};

export default EmployeeListPage;
