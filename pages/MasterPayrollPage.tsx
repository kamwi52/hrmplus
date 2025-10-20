import React, { useState } from 'react';
// Fix: Correct import path for types.
import type { MasterPayrollItem } from '../types';
import { Modal } from '../components/Modal';
// Fix: Correct import path for Icons component.
import { PlusIcon, PencilIcon, TrashIcon } from '../components/Icons';

interface MasterItemFormProps {
    onSubmit: (item: Omit<MasterPayrollItem, 'id'> | MasterPayrollItem) => void;
    onClose: () => void;
    itemToEdit?: MasterPayrollItem | null;
}

const MasterItemForm: React.FC<MasterItemFormProps> = ({ onSubmit, onClose, itemToEdit }) => {
    const [formData, setFormData] = useState({
        code: itemToEdit?.code || '',
        description: itemToEdit?.description || '',
        period: itemToEdit?.period || '999',
        type: itemToEdit?.type || 'Earning',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const itemData = itemToEdit ? { ...itemToEdit, ...formData } : formData;
        onSubmit(itemData as any); // Type assertion to satisfy onSubmit signature
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Code</label>
                    <input type="text" name="code" value={formData.code} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Period</label>
                    <input type="text" name="period" value={formData.period} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <input type="text" name="description" value={formData.description} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select name="type" value={formData.type} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">
                    <option value="Earning">Earning</option>
                    <option value="Deduction">Deduction</option>
                </select>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">{itemToEdit ? 'Save Changes' : 'Add Item'}</button>
            </div>
        </form>
    );
};


interface MasterPayrollPageProps {
    masterItems: MasterPayrollItem[];
    addMasterItem: (item: Omit<MasterPayrollItem, 'id'>) => void;
    updateMasterItem: (item: MasterPayrollItem) => void;
    deleteMasterItem: (itemId: string) => void;
    onBack: () => void;
}

const MasterPayrollPage: React.FC<MasterPayrollPageProps> = ({ masterItems, addMasterItem, updateMasterItem, deleteMasterItem, onBack }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemToEdit, setItemToEdit] = useState<MasterPayrollItem | null>(null);

    const openAddModal = () => {
        setItemToEdit(null);
        setIsModalOpen(true);
    };

    const openEditModal = (item: MasterPayrollItem) => {
        setItemToEdit(item);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setItemToEdit(null);
    };

    const handleFormSubmit = (itemData: Omit<MasterPayrollItem, 'id'> | MasterPayrollItem) => {
        if ('id' in itemData) {
            updateMasterItem(itemData);
        } else {
            addMasterItem(itemData);
        }
        closeModal();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                     <button onClick={onBack} className="text-blue-600 hover:underline mb-2">&larr; Back to Payroll</button>
                     <h1 className="text-3xl font-semibold text-gray-800">Master Payroll Data</h1>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add New Item
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {masterItems.map(item => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.code}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.type === 'Earning' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{item.type}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.period}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => openEditModal(item)} className="text-indigo-600 hover:text-indigo-900 mr-4"><PencilIcon className="h-5 w-5"/></button>
                                    <button onClick={() => deleteMasterItem(item.id)} className="text-red-600 hover:text-red-900"><TrashIcon className="h-5 w-5"/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={itemToEdit ? 'Edit Master Item' : 'Add New Master Item'}>
                <MasterItemForm onSubmit={handleFormSubmit} onClose={closeModal} itemToEdit={itemToEdit} />
            </Modal>
        </div>
    );
};

export default MasterPayrollPage;
