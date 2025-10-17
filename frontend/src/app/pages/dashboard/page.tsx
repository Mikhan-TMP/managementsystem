"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/ui/buttons';
import AddUser from '../../layouts/UserManagement/AddUser';
import EditUser from '@/app/layouts/UserManagement/EditUser';
import { 
    CogIcon, 
    FolderIcon, 
    HelpCircle, 
    HomeIcon,
    Users,
    Calendar,
    FileText,
    BarChart3,
    MessageSquare,
    Lock,
    PlusCircle
} from 'lucide-react';
import Sidebar, { type SidebarMenuItem } from "@/app/layouts/templates/sidebar";
import { getSidebarItems } from '@/api/api-client';
import DashboardContent from '@/app/layouts/templates/dashboardContent';
import UsersTable, { UsersTableRef } from '@/app/layouts/templates/usersTable';
import { FormContainer } from '@/app/components/ui/forms';

// Icon mapping helper
const iconMap: { [key: string]: React.ReactNode } = {
    '<HomeIcon>': <HomeIcon className="h-5 w-5" />,
    'Users': <Users className="h-5 w-5" />,
    'Projects': <FolderIcon className="h-5 w-5" />,
    'Calendar': <Calendar className="h-5 w-5" />,
    'Documentation': <FileText className="h-5 w-5" />,
    'Reports': <BarChart3 className="h-5 w-5" />,
    'Communication': <MessageSquare className="h-5 w-5" />,
    'Settings': <CogIcon className="h-5 w-5" />,
    'AccessControl': <Lock className="h-5 w-5" />,
    'Help': <HelpCircle className="h-5 w-5" />,
};

const Dashboard: React.FC = () => {
    const [showAddUser, setShowAddUser] = useState(false);
    const [showEditUser, setShowEditUser] = useState(false);
    const [editingUserId, setEditingUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [sidebarItems, setSidebarItems] = useState<SidebarMenuItem[]>([]);
    const [sidebarLoading, setSidebarLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('Dashboard');
    const supabase = createClientComponentClient();
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);
    const [modal, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const usersTableRef = useRef<UsersTableRef>(null);


    // Load active section from localStorage on mount
    useEffect(() => {
        const savedSection = localStorage.getItem('activeSection');
        if (savedSection) {
            setActiveSection(savedSection);
        }
    }, []);

    // Save active section to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('activeSection', activeSection);
    }, [activeSection]);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            
            if (!session) {
                router.push('/pages/authentication');
            } else {
                setUser(session.user);
                
                try {
                    setSidebarLoading(true);
                    const token = session.access_token;
                    const items = await getSidebarItems(token);
                    
                    console.log('Sidebar items received:', items);
                    
                    const transformedItems: SidebarMenuItem[] = items.map((item: any) => ({
                        label: item.name,
                        href: `#${item.name.toLowerCase().replace(/\s+/g, '-')}`,
                        icon: getIconForItem(item.icon || item.name),
                        exact: item.name === 'Dashboard',
                        onClick: (e?: React.MouseEvent) => {
                            e?.preventDefault();
                            setActiveSection(item.name);
                        },
                    }));
                    
                    setSidebarItems(transformedItems);
                } catch (error) {
                    console.error('Error fetching sidebar items:', error);
                    setSidebarItems([
                        {
                            label: "Dashboard",
                            href: "#dashboard",
                            icon: <HomeIcon className="h-5 w-5" />,
                            exact: true,
                            onClick: (e?: React.MouseEvent) => {
                                e?.preventDefault();
                                setActiveSection('Dashboard');
                            },
                        }
                    ]);
                } finally {
                    setSidebarLoading(false);
                }
                
                setLoading(false);
            }
        };

        checkUser();

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                localStorage.removeItem('activeSection'); 
                router.push('/pages/authentication');
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [supabase, router]);

    // Helper function to get icon based on name or icon string
    const getIconForItem = (iconString: string | null): React.ReactNode => {
        if (!iconString) return <HelpCircle className="h-5 w-5" />;
        
        // If icon is stored as a key in database
        if (iconMap[iconString]) {
            return iconMap[iconString];
        }
        
        // Match by name
        const normalizedName = iconString.replace(/\s+/g, '').replace(/\//g, '');
        return iconMap[normalizedName] || <HelpCircle className="h-5 w-5" />;
    };

    const handleSignOut = async () => {
        // Reset active section to Dashboard
        setActiveSection('Dashboard');
        localStorage.setItem('activeSection', 'Dashboard');
        
        await supabase.auth.signOut();
        router.push('/pages/authentication');
    };

    // Render content based on active section
    const renderContent = () => {
        switch (activeSection) {
            case 'Dashboard':
                return (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Dashboard Content</h2>
                        <div className="mt-4">
                            <p className="text-gray-600 dark:text-gray-400">
                                Welcome to your centralized command center where you can monitor key metrics, track ongoing activities, and access all your essential tools in one place.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Add your dashboard widgets/cards here */}
                            <DashboardContent />
                        </div>
                    </div>
                );
            
            case 'Users':
                return (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Users Management</h2>
                            <Button 
                                variant="secondary"
                                className='text-sm cursor-pointer'
                                onClick={() => setShowAddUser(true)}>
                                <PlusCircle className="h-5 w-5 mr-2 text-green-500" />
                                Add User
                            </Button>
                        </div>
                        <div className="mt-4">
                            <p className="text-gray-600 dark:text-gray-400">
                                Manage your organization's users, assign roles and permissions, and track user activity from this centralized dashboard.
                            </p>
                            <UsersTable 
                                ref={usersTableRef}
                                onViewUser={(user) => {
                                    console.log('View user:', user);
                                    setSelectedUser(user);
                                    setModalOpen(true);
                                }} 
                                onEditUser={(userId) => {
                                    setEditingUserId(userId);
                                    setShowEditUser(true);
                                }}
                            />
                        </div>

                    </div>
                );
            
            case 'Projects':
                return (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Projects</h2>
                        <p className="text-gray-600 dark:text-gray-400">Projects content goes here</p>
                    </div>
                );
            
            case 'Calendar':
                return (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Calendar</h2>
                        <p className="text-gray-600 dark:text-gray-400">Calendar content goes here</p>
                    </div>
                );
            
            case 'Documentation':
                return (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Documentation</h2>
                        <p className="text-gray-600 dark:text-gray-400">Documentation content goes here</p>
                    </div>
                );
            
            case 'Reports':
                return (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Reports</h2>
                        <p className="text-gray-600 dark:text-gray-400">Reports content goes here</p>
                    </div>
                );
            
            case 'Communication':
                return (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Communication</h2>
                        <p className="text-gray-600 dark:text-gray-400">Communication content goes here</p>
                    </div>
                );
            
            case 'Settings':
                return (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Settings</h2>
                        <p className="text-gray-600 dark:text-gray-400">Settings content goes here</p>
                    </div>
                );
            
            case 'Access Control':
                return (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Access Control</h2>
                        <p className="text-gray-600 dark:text-gray-400">Access Control content goes here</p>
                    </div>
                );
            
            case 'Help':
                return (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Help</h2>
                        <p className="text-gray-600 dark:text-gray-400">Help content goes here</p>
                    </div>
                );
            
            default:
                return (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">{activeSection}</h2>
                        <p className="text-gray-600 dark:text-gray-400">Content for {activeSection}</p>
                    </div>
                );
        }
    };

    if (loading || sidebarLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <div className="h-screen grid grid-cols-[auto_1fr] gap-4 p-4 bg-gray-50 dark:bg-neutral-950">
                <Sidebar
                    menuItems={sidebarItems}
                    isCollapsed={collapsed}
                    onToggle={setCollapsed}
                    className="h-full"
                    header={
                        <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                            APPLICATION NAME
                        </div>
                    }
                />
                {/* Dynamic Content */}
                <main className="rounded-xl border border-gray-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 p-6 shadow-sm overflow-auto">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                                Welcome Back, {user?.user_metadata.first_name}!
                            </h1>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                onClick={handleSignOut}
                                variant="outline"
                            >
                                Sign Out
                            </Button>
                        </div>
                    </div>
                    
                    {/* Render content based on selected sidebar item */}
                    {renderContent()}
                    
                </main>

                {/* Modal for User Actions */}
                {modal && selectedUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
                        <FormContainer
                            title="User Information"
                            description="Detailed view of the selected user."
                            onSubmit={(e) => { 
                                e.preventDefault(); 
                                setModalOpen(false);
                                setSelectedUser(null);
                            }}
                            className="w-[600px] mx-auto max-h-[80vh] overflow-y-auto"
                        >
                            <div className="">
                                {/* Header Section with Avatar */}
                                <div className="flex items-center gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                        {selectedUser.user_metadata?.first_name?.[0]}{selectedUser.user_metadata?.last_name?.[0]}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                            {selectedUser.user_metadata?.full_name || 'Unknown User'}
                                        </h3>
                                        <p className="text-sm text-gray-500 italic dark:text-gray-400">
                                            @{selectedUser.user_metadata?.username || 'N/A'}
                                        </p>
                                        <p className="text-[10px] text-gray-500 dark:text-gray-400">
                                            UID: {selectedUser.id || 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                {/* Status and Role Badges */}
                                <div className="flex-col  gap-3 justify-center items-center border-b border-gray-200 dark:border-gray-700 mb-2">
                                    <h4 className="text-xs mt-3 font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        System Information
                                    </h4>
                                    <div className="flex gap-4 mb-4">
                                        <div className="flex-1  bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2 ">
                                            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Role</div>
                                            <div className="flex items-center gap-2">
                                                <Lock className="h-4 w-4 text-blue-500" />
                                                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                    {selectedUser.user_metadata?.role_name || 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2 ">
                                            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Status</div>
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${
                                                selectedUser.user_metadata?.status === 'active' 
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${
                                                    selectedUser.user_metadata?.status === 'active' 
                                                        ? 'bg-green-500 animate-pulse' 
                                                        : 'bg-gray-400'
                                                }`}></span>
                                                {selectedUser.user_metadata?.status 
                                                    ? selectedUser.user_metadata.status.charAt(0).toUpperCase() + 
                                                        selectedUser.user_metadata.status.slice(1) 
                                                    : 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className="space-y-4 border-b border-gray-200 dark:border-gray-700 pb-4">
                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                        <MessageSquare className="h-4 w-4" />
                                        Contact Information
                                    </h4>
                                    <div className="grid gap-4">
                                        <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Email</div>
                                                <div className="text-sm text-gray-900 dark:text-gray-100 truncate">
                                                    {selectedUser.email || 'N/A'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Personal Details */}
                                <div className="space-y-4 mt-2">
                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        Personal Details
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">First Name</label>
                                            <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                                                {selectedUser.user_metadata?.first_name || 'N/A'}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Last Name</label>
                                            <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                                                {selectedUser.user_metadata?.last_name || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => { setModalOpen(false); setSelectedUser(null); }}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-2.5 px-6 rounded-lg transition-colors"
                                >
                                    Close
                                </button>

                            </div>
                        </FormContainer>
                    </div>
                )}

                {showAddUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
                        <FormContainer
                            title="Create a New User Account"
                            description="Fill in the details below to create a new user account."
                            className="w-[600px] mx-auto max-h-[80vh] overflow-y-auto"
                        >
                            <AddUser 
                                onSuccess={() => {
                                    setShowAddUser(false);
                                    // Refresh the users table
                                    usersTableRef.current?.refresh();
                            }}
                        />

                        <div className="flex gap-3 mt-6">
                            <button
                                type="button"
                                onClick={() => { setShowAddUser(false); }}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-2.5 px-6 rounded-lg transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </FormContainer>
                </div>
                )}

                {/* Edit User Modal */}
                {showEditUser && editingUserId && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <FormContainer
                            title="Edit User"
                            description="Update the user's information below."
                            className="w-[600px] mx-auto max-h-[80vh] overflow-y-auto"
                        >
                            <EditUser 
                                userId={editingUserId}
                                onSuccess={() => {
                                    setShowEditUser(false);
                                    setEditingUserId(null);
                                    usersTableRef.current?.refresh();
                                }}
                            />

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => { 
                                        setShowEditUser(false);
                                        setEditingUserId(null);
                                    }}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-2.5 px-6 rounded-lg transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </FormContainer>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
