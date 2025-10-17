"use client";

import { useEffect, useState } from "react";
import FormInput from "../../components/ui/form_input";
import { SelectInput } from "../../components/ui/select_inputs";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { AnimatedNotification } from '../../components/ui/notifications';
import { Button } from "../../components/ui/buttons";
import { getRoles, updateUser } from '@/api/api-client';

const supabase = createClientComponentClient();

interface EditUserProps {
    userId: string;
    onSuccess?: () => void;
}

type SelectOption = {
    value: string;
    label: string;
};

export default function EditUser({ userId, onSuccess }: EditUserProps) {
    //--------------------------------
    // FORM HANDLING
    //--------------------------------
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        role: '',
        email: '',
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [roleOptions, setRoleOptions] = useState<SelectOption[]>([]);
    const [isLoadingRoles, setIsLoadingRoles] = useState(true);
    const [roleError, setRoleError] = useState('');

    // Fetch user data and roles on mount
    useEffect(() => {
        async function fetchData() {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const token = session?.access_token;

                if (!token) {
                    throw new Error('Not authenticated');
                }

                // Fetch user data
                const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!userResponse.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const userData = await userResponse.json();
                
                setFormData({
                    firstName: userData.first_name || '',
                    lastName: userData.last_name || '',
                    username: userData.username || '',
                    email: userData.email || '',
                    role: userData.role_id?.toString() || '',
                });

                // Fetch roles
                const roles = await getRoles(token);
                const formattedRoles = roles.map((role: any) => ({
                    value: role.id.toString(),
                    label: role.name,
                }));
                setRoleOptions(formattedRoles);

            } catch (error: any) {
                console.error('Error fetching data:', error);
                setErrorMessage(error.message || 'Failed to load user data');
                setShowError(true);
            } finally {
                setIsLoading(false);
                setIsLoadingRoles(false);
            }
        }

        fetchData();
    }, [userId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        
        setFormData((prev) => ({
            ...prev,
            role: value,
        }));

        if (value === '1') {
            setRoleError('Admin role requires additional permissions.');
        } else {
            setRoleError('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsSubmitting(true);
        setShowError(false);

        const { firstName, lastName, username, email, role } = formData;

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            if (!token) {
                throw new Error('Not authenticated');
            }

            await updateUser(userId, {
                firstName,
                lastName,
                username,
                email,
                roleId: parseInt(role),
            }, token);

            setShowSuccess(true);
            
            setTimeout(() => {
                setShowSuccess(false);
                onSuccess?.();
            }, 2000);

        } catch (error: any) {
            console.error('Error updating user:', error);
            setErrorMessage(error.message || 'Failed to update user');
            setShowError(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <>
            <div className="flex justify-center items-center w-full">
                <form className="space-y-4 w-full" onSubmit={handleSubmit}>
                    <div>
                        <FormInput
                            label="First Name"
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="John"
                            required
                        />
                    </div>
                    
                    <div>
                        <FormInput
                            label="Last Name"
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Doe"
                            required
                        />
                    </div>

                    <div>
                        <FormInput
                            label="Email Address"
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john.doe@example.com"
                            required
                        />
                    </div>

                    <div>
                        <FormInput
                            label="Username"
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="johndoe"
                            required
                        />
                    </div>

                    <div>
                        <SelectInput
                            label="User Role"
                            name="role"
                            id="role-select"
                            value={formData.role}
                            onChange={handleRoleChange}
                            options={roleOptions}
                            placeholder={isLoadingRoles ? "Loading roles..." : "Select a role"}
                            error={roleError}
                            required
                            disabled={isLoadingRoles}
                        />
                    </div>
                    
                    <Button 
                        type="submit"
                        variant="primary" 
                        size="medium"
                        className="w-full"
                        disabled={isSubmitting || isLoadingRoles}
                    >
                        {isSubmitting ? 'Updating User...' : 'Update User'}
                    </Button>
                </form>
            </div>
            
            <AnimatedNotification
                type="success"
                message="User updated successfully!"
                isVisible={showSuccess}
                onClose={() => setShowSuccess(false)}
                duration={5000}
            />
            <AnimatedNotification
                type="error"
                message={errorMessage}
                isVisible={showError}
                onClose={() => setShowError(false)}
                duration={5000}
            />
        </>
    );
}