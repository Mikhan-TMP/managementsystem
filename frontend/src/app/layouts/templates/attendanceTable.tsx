"use client";

import React, { useState, useEffect, forwardRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import FormInput from '../../components/ui/form_input';
import { Search } from 'lucide-react';
import { getAttendanceRecords } from '@/api/api-client';

interface AttendanceRecord {
    id: string;
    user_id: string;
    user_name: string;
    time_in: string;
    time_out: string | null;
    date: string;
    status: string;
    remarks: string | null;
    created_at: string;
    updated_at: string;
}

interface AttendanceTableProps {
    onViewAttendance?: (attendance: AttendanceRecord) => void;
}

const AttendanceTable = forwardRef<HTMLDivElement, AttendanceTableProps>(({ onViewAttendance }, ref) => {
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const supabase = createClientComponentClient();

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        try {
            setLoading(true);
            const { data: { session } } = await supabase.auth.getSession();
            
            if (!session?.access_token) {
                throw new Error('No authentication token found');
            }

            const data = await getAttendanceRecords(session.access_token);
            setAttendance(data || []);
            console.log('Fetched attendance data:', data);
        } catch (err) {
            console.error('Error fetching attendance:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch attendance');
        } finally {
            setLoading(false);
        }
    };

    const filteredAttendance = attendance.filter(record =>
        record.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.date.includes(searchTerm) ||
        (record.remarks && record.remarks.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentAttendance = filteredAttendance.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredAttendance.length / itemsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const formatTime = (timeString: string | null) => {
        if (!timeString) return 'N/A';
        
        // Handle time-only format (HH:MM:SS)
        const timeParts = timeString.match(/^(\d{2}):(\d{2}):(\d{2})$/);
        if (timeParts) {
            let hours = parseInt(timeParts[1]);
            const minutes = timeParts[2];
            const period = hours >= 12 ? 'PM' : 'AM';
            
            // Convert to 12-hour format
            hours = hours % 12;
            hours = hours ? hours : 12; // 0 should be 12
            
            return `${hours}:${minutes} ${period}`;
        }
        
        // Handle full datetime format (fallback)
        try {
            return new Date(timeString).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        } catch {
            return 'Invalid Time';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                Error: {error}
            </div>
        );
    }

    return (
        <>
            <div className="flex justify-between items-center mb-4 mt-5 gap-4">
                <div className="flex-1">
                    <FormInput
                        label=''
                        type="text"
                        name='search'
                        id='search'
                        placeholder="Search attendance..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        icon={<Search size={20} />}
                        iconPosition="left"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700">Show:</label>
                    <select
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-600">
                    <thead className="bg-black/80 text-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-white/90 uppercase tracking-wider">
                                #
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-white/90 uppercase tracking-wider">
                                User Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-white/90 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-white/90 uppercase tracking-wider">
                                Time In
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-white/90 uppercase tracking-wider">
                                Time Out
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-white/90 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-white/90 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-white/90 uppercase tracking-wider">
                                Remarks
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-white/90 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-purple-700/10 divide-y divide-gray-200">
                        {currentAttendance.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                                    {searchTerm ? 'No attendance records found matching your search' : 'No attendance records found'}
                                </td>
                            </tr>
                        ) : (
                            currentAttendance.map((record, index) => (
                                <tr key={record.id} className="hover:bg-gray-800/20 text-[12px]">
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        {indexOfFirstItem + index + 1}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {record.user_name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {formatDate(record.date)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {formatTime(record.time_in)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {formatTime(record.time_out)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {formatDate(record.date)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            record.status === 'present' ? 'bg-green-100 text-green-800' :
                                            record.status === 'late' ? 'bg-blue-100 text-blue-800' :
                                            record.status === 'excused' ? 'bg-yellow-100 text-yellow-800' :
                                            record.status === 'absent' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {record.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {record.remarks || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => onViewAttendance?.(record)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                View
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {filteredAttendance.length > 0 && (
                <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-gray-700">
                        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredAttendance.length)} of {filteredAttendance.length} records
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                        >
                            Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                            <button
                                key={pageNumber}
                                onClick={() => handlePageChange(pageNumber)}
                                className={`px-3 py-1 border border-gray-300 rounded-lg ${
                                    currentPage === pageNumber ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                                }`}
                            >
                                {pageNumber}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </>
    );
});

AttendanceTable.displayName = 'AttendanceTable';

export default AttendanceTable;