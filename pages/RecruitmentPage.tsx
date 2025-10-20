import React, { useState, useMemo } from 'react';
// Fix: Correct import path for types.
import type { JobPosition, Candidate, Department } from '../types';
import { Modal } from '../components/Modal';
// Fix: Correct import path for Icons component.
import { PlusIcon } from '../components/Icons';

// Form for Job Position
interface JobPositionFormProps {
    onSubmit: (position: Omit<JobPosition, 'id'>) => void;
    onClose: () => void;
}
const JobPositionForm: React.FC<JobPositionFormProps> = ({ onSubmit, onClose }) => {
    const [formData, setFormData] = useState({ title: '', department: 'Engineering' as Department, status: 'Open' as 'Open' | 'Closed' });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSubmit(formData); };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Job Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <select name="department" value={formData.department} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">
                    <option>Engineering</option><option>Marketing</option><option>Sales</option><option>HR</option><option>Design</option>
                </select>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Add Position</button>
            </div>
        </form>
    );
};

// Form for Candidate
interface CandidateFormProps {
    jobPositions: JobPosition[];
    onSubmit: (candidate: Omit<Candidate, 'id'>) => void;
    onClose: () => void;
}
const CandidateForm: React.FC<CandidateFormProps> = ({ jobPositions, onSubmit, onClose }) => {
    const openPositions = jobPositions.filter(jp => jp.status === 'Open');
    const [formData, setFormData] = useState({
        jobId: openPositions[0]?.id || '', firstName: '', lastName: '', email: '', status: 'Applied' as Candidate['status']
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if(!formData.jobId) { alert('Please select a job position.'); return; } onSubmit(formData); };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Applying for</label>
                <select name="jobId" value={formData.jobId} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">
                    <option value="" disabled>Select a position</option>
                    {openPositions.map(jp => <option key={jp.id} value={jp.id}>{jp.title}</option>)}
                </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Add Candidate</button>
            </div>
        </form>
    );
};

interface RecruitmentPageProps {
    jobPositions: JobPosition[];
    candidates: Candidate[];
    addJobPosition: (position: Omit<JobPosition, 'id'>) => void;
    updateJobPosition: (position: JobPosition) => void;
    addCandidate: (candidate: Omit<Candidate, 'id'>) => void;
    updateCandidate: (candidate: Candidate) => void;
}

const RecruitmentPage: React.FC<RecruitmentPageProps> = (props) => {
    const [jobModalOpen, setJobModalOpen] = useState(false);
    const [candidateModalOpen, setCandidateModalOpen] = useState(false);

    const handleJobSubmit = (position: Omit<JobPosition, 'id'>) => {
        props.addJobPosition(position);
        setJobModalOpen(false);
    };
    const handleCandidateSubmit = (candidate: Omit<Candidate, 'id'>) => {
        props.addCandidate(candidate);
        setCandidateModalOpen(false);
    };

    const handleStatusChange = (candidate: Candidate, newStatus: Candidate['status']) => {
        props.updateCandidate({ ...candidate, status: newStatus });
    };

    const jobTitleMap = useMemo(() => {
        return props.jobPositions.reduce((acc, jp) => {
            acc[jp.id] = jp.title;
            return acc;
        }, {} as Record<string, string>);
    }, [props.jobPositions]);

    const statusClasses: Record<Candidate['status'], string> = {
        Applied: 'bg-blue-100 text-blue-800',
        Interviewing: 'bg-yellow-100 text-yellow-800',
        Offered: 'bg-indigo-100 text-indigo-800',
        Hired: 'bg-green-100 text-green-800',
        Rejected: 'bg-red-100 text-red-800',
    };

    return (
        <div>
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Recruitment</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Open Positions */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-700">Open Positions</h2>
                        <button onClick={() => setJobModalOpen(true)} className="flex items-center text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-md"><PlusIcon className="h-4 w-4 mr-1"/>New Position</button>
                    </div>
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                         <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {props.jobPositions.map(jp => (
                                    <tr key={jp.id}>
                                        <td className="px-4 py-4 text-sm font-medium text-gray-900">{jp.title}</td>
                                        <td className="px-4 py-4 text-sm text-gray-500">{jp.department}</td>
                                        <td className="px-4 py-4 text-sm"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${jp.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{jp.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* Candidates */}
                <div>
                     <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-700">Candidates</h2>
                        <button onClick={() => setCandidateModalOpen(true)} className="flex items-center text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-md"><PlusIcon className="h-4 w-4 mr-1"/>New Candidate</button>
                    </div>
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                         <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {props.candidates.map(c => (
                                    <tr key={c.id}>
                                        <td className="px-4 py-4 text-sm font-medium text-gray-900">{c.firstName} {c.lastName}</td>
                                        <td className="px-4 py-4 text-sm text-gray-500">{jobTitleMap[c.jobId]}</td>
                                        <td className="px-4 py-4 text-sm">
                                            <select value={c.status} onChange={e => handleStatusChange(c, e.target.value as Candidate['status'])} className={`border-none text-xs font-semibold rounded-full ${statusClasses[c.status]}`}>
                                                <option value="Applied">Applied</option>
                                                <option value="Interviewing">Interviewing</option>
                                                <option value="Offered">Offered</option>
                                                <option value="Hired">Hired</option>
                                                <option value="Rejected">Rejected</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Modal isOpen={jobModalOpen} onClose={() => setJobModalOpen(false)} title="Add New Job Position">
                <JobPositionForm onSubmit={handleJobSubmit} onClose={() => setJobModalOpen(false)} />
            </Modal>
             <Modal isOpen={candidateModalOpen} onClose={() => setCandidateModalOpen(false)} title="Add New Candidate">
                <CandidateForm jobPositions={props.jobPositions} onSubmit={handleCandidateSubmit} onClose={() => setCandidateModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default RecruitmentPage;
