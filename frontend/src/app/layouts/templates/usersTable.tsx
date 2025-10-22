"use client";

import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Eye, Pencil, Trash2, Search, SearchIcon } from 'lucide-react';
import { Button } from '../../components/ui/buttons';
import FormInput from '@/app/components/ui/form_input';

interface User {
    id: string;
    email: string;
    user_metadata: {
        first_name?: string;
        last_name?: string;
        full_name?: string;
        username?: string;
        role_id?: string;
        role_name?: string;
        status?: string;
        department_name?: string;
    };
}

interface UsersTableProps {
    onViewUser?: (user: User) => void;
    onEditUser?: (userId: string) => void;
}

export interface UsersTableRef {
    refresh: () => void;
}

const UsersTable = forwardRef<UsersTableRef, UsersTableProps>(({ onViewUser, onEditUser }, ref) => {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false); // Add this new state
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const supabase = createClientComponentClient();

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        // Filter users based on search term
        const filtered = users.filter(user => {
            const fullName = user.user_metadata?.full_name || 
                `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim();
            const searchLower = searchTerm.toLowerCase();
            
            return (
                fullName.toLowerCase().includes(searchLower) ||
                user.email.toLowerCase().includes(searchLower) ||
                (user.user_metadata?.username || '').toLowerCase().includes(searchLower) ||
                (user.user_metadata?.role_name || '').toLowerCase().includes(searchLower) ||
                (user.user_metadata?.status || '').toLowerCase().includes(searchLower)
            );
        });
        setFilteredUsers(filtered);
        setCurrentPage(1); // Reset to first page when search changes
    }, [searchTerm, users]);

    // Calculate pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    const fetchUsers = async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true); // Set refreshing state instead of loading
            } else {
                setLoading(true);
            }
            
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            if (!token) {
                setError('No authentication token found');
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            const data = await response.json();
            console.log(data);
            setUsers(data);
            setFilteredUsers(data);
        } catch (err: any) {
            console.error('Error fetching users:', err);
            setError(err.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Expose refresh function to parent
    useImperativeHandle(ref, () => ({
        refresh: () => fetchUsers(true) // Pass true to indicate this is a refresh
    }));

    const handleView = (user: User) => {
        console.log('View user:', user);
        onViewUser?.(user);
    };

    const handleEdit = (userId: string) => {
        console.log('Edit user:', userId);
        onEditUser?.(userId);
    };

    const handleDelete = async (userId: string) => {
        if (!confirm('Are you sure you want to delete this user?')) {
            return;
        }

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            if (!token) {
                alert('Not authenticated');
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            // Refresh the user list
            await fetchUsers();
            alert('User deleted successfully');
        } catch (err: any) {
            console.error('Error deleting user:', err);
            alert(err.message);
        }
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleItemsPerPageChange = (value: number) => {
        setItemsPerPage(value);
        setCurrentPage(1); // Reset to first page
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
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
                Error: {error}
            </div>
        );
    }

    return (
        <>
            {/* Refreshing Overlay */}
            {refreshing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Refreshing users...
                        </p>
                    </div>
                </div>
            )}

            {/* Search and Items per page controls */}
            <div className="flex justify-between items-center mb-4 mt-5 gap-4">
                <div className="relative flex-1 max-w-sm">
                        <FormInput
                            label=""
                            type="text"
                            id="name"
                            name="name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search"
                            icon={<SearchIcon size={20} />}
                            iconPosition="left"
                            className='text-sm'
                        />

                </div>
                {/* Here */}
                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-300">Show:</label>
                    <select
                        value={itemsPerPage}
                        onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                        className="px-3 py-2 border bg-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-600">
                    <thead className="bg-black/80 text-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-white/90 uppercase tracking-wider">
                                #
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-white/90 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-white/90 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-white/90 uppercase tracking-wider">
                                Username
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-bold text-white/90 uppercase tracking-wider'>
                                Department
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-white/90 uppercase tracking-wider">
                                Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-white/90 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-white/90 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-purple-700/10 divide-y divide-gray-200">
                        {currentUsers.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                                    {searchTerm ? 'No users found matching your search' : 'No users found'}
                                </td>
                            </tr>
                        ) : (
                            currentUsers.map((user, index) => (
                                <tr key={user.id} className="hover:bg-gray-800/20 text-[12px]">
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        {indexOfFirstItem + index + 1}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                            {user.user_metadata?.full_name || 
                                            `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim() || 
                                            'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {user.user_metadata?.username || 'N/A'}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        {user.user_metadata?.department_name || 'N/A'}
                                    </td>   
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        {user.user_metadata?.role_name || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-sm ${
                                            user.user_metadata?.status === 'active' 
                                                ? 'bg-green-600 text-white' 
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {user.user_metadata?.status ? user.user_metadata.status.charAt(0).toUpperCase() + user.user_metadata.status.slice(1) : 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleView(user)}
                                                className="text-blue-600 bg-white rounded-xl p-2 hover:text-blue-900 transition-colors cursor-pointer"
                                                title="View user"
                                            >
                                                <Eye className="h-5 w-5"/>
                                            </button>
                                            <button
                                                onClick={() => handleEdit(user.id)}
                                                className="text-yellow-600 rounded-xl hover:text-yellow-900 transition-colors bg-white p-2 cursor-pointer"
                                                title="Edit user"
                                            >
                                                <Pencil className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="text-red-600 rounded-xl hover:text-red-900 bg-white p-2 transition-colors cursor-pointer"
                                                title="Delete user"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {filteredUsers.length > 0 && (
                <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-gray-700">
                        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} entries
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                        >
                            Previous
                        </button>
                        {[...Array(totalPages)].map((_, index) => {
                            const pageNumber = index + 1;
                            // Show first page, last page, current page, and pages around current page
                            if (
                                pageNumber === 1 ||
                                pageNumber === totalPages ||
                                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                            ) {
                                return (
                                    <button
                                        key={pageNumber}
                                        onClick={() => handlePageChange(pageNumber)}
                                        className={`px-3 py-1 border rounded-lg ${
                                            currentPage === pageNumber
                                                ? 'bg-purple-600 text-white border-purple-600'
                                                : 'border-gray-300 hover:bg-gray-100'
                                        }`}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            } else if (
                                pageNumber === currentPage - 2 ||
                                pageNumber === currentPage + 2
                            ) {
                                return <span key={pageNumber} className="px-2">...</span>;
                            }
                            return null;
                        })}
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

UsersTable.displayName = 'UsersTable';

export default UsersTable;