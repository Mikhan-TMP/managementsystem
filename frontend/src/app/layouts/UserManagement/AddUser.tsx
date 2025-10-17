"use client";

import { useEffect, useState } from "react";
import FormInput from "../../components/ui/form_input";
import { SelectInput } from "../../components/ui/select_inputs";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { AnimatedNotification } from '../../components/ui/notifications';
import { Button } from "../../components/ui/buttons";
import { createUser, getRoles } from '@/api/api-client';

const supabase = createClientComponentClient();

interface AddUserProps {
    onSuccess?: () => void;
}

export default function AddUser({ onSuccess }: AddUserProps) {
    //--------------------------------
    // FORM HANDLING
    //--------------------------------
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        role: '',
        email: '',
        password: '',
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsSubmitting(true);
        setShowError(false);

        const { firstName, lastName, username, email, password, role } = formData;
        if (!firstName || !lastName || !username || !email || !password || !role) {
            setErrorMessage('Please fill in all required fields.');
            setShowError(true);
            setIsSubmitting(false);
            return;
        }

        try {
            const { data } = await supabase.auth.getSession();
            console.log('Current session data:', data);
            const token = data?.session?.access_token;

            if (!token) throw new Error('Not authenticated.');

            const result = await createUser(formData, token);
            console.log('User created successfully:', result);

            setShowSuccess(true);
            
            // Reset form
            setFormData({
                firstName: '',
                lastName: '',
                username: '',
                role: '',
                email: '',
                password: '',
            });
            
            // Call success callback after 2 seconds
            setTimeout(() => {
                setShowSuccess(false);
                onSuccess?.();
            }, 2000);
            
        } catch (error: any) {
            console.error('Error creating user:', error);
            setErrorMessage(error.message || 'Failed to create user');
            setShowError(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    //--------------------------------
    //ROLE SELECTION
    //--------------------------------
    type SelectOption = {
        value: string;
        label: string;
    };
    
    const [roleOptions, setRoleOptions] = useState<SelectOption[]>([]);
    const [isLoadingRoles, setIsLoadingRoles] = useState(true);
    const [roleError, setRoleError] = useState('');

    useEffect(() => {
        async function fetchRoles() {
            try {
                const { data } = await supabase.auth.getSession();
                const token = data?.session?.access_token;

                if (!token) {
                    console.error('No authentication token found');
                    setRoleOptions([
                        { value: '1', label: 'User' },
                        { value: '2', label: 'Guest' },
                    ]);
                    setIsLoadingRoles(false);
                    return;
                }

                console.log('Fetching roles with token:', token?.substring(0, 20) + '...');
                const roles = await getRoles(token);
                console.log('Roles received:', roles);
                
                const mappedRoles = roles.map((role: { id: string | number; name: string }) => ({
                    value: role.id.toString(),
                    label: role.name
                }));
                setRoleOptions(mappedRoles);
            } catch (error: any) {
                console.error('Error fetching roles:', error);
                console.error('Error details:', {
                    message: error.message,
                    stack: error.stack,
                });
                setRoleOptions([
                    { value: '1', label: 'User' },
                    { value: '2', label: 'Guest' },
                ]);
            } finally {
                setIsLoadingRoles(false);
            }
        }

        fetchRoles();
    }, []);

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        
        // Update formData with the role value
        setFormData((prev) => ({
            ...prev,
            role: value,
        }));
        
        // Optional: Add role-specific validation
        if (value === '1') { // Assuming '1' is admin role ID
            setRoleError('Admin role requires additional permissions.');
        } else {
            setRoleError('');
        }
    };

    //--------------------------------
    // RENDER
    //--------------------------------
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
                        <FormInput
                            label="Password"
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
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
                        {isSubmitting ? 'Creating Account...' : 'Create Account'}
                    </Button>
                </form>
            </div>
            
            <AnimatedNotification
                type="success"
                message="User account created successfully!"
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