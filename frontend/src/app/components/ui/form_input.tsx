import React from 'react';

// ============================================
// REUSABLE FORM INPUT COMPONENT
// ============================================

interface FormInputProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  id: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  name,
  id,
  error,
  disabled = false,
  className = '',
  required = false,
  icon,
  iconPosition = 'left',
}) => {
  return (
    <div className="w-full mb-4">
      {/* Label */}
      <label
        htmlFor={id}
        className="block text-sm font-medium text-white/80 mb-2"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Input Field with Optional Icon */}
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {icon}
          </div>
        )}

        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-4 py-2 
            border rounded-lg 
            text-white/80
            placeholder-gray-400
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${icon && iconPosition === 'right' ? 'pr-10' : ''}
            ${className}
          `}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />

        {icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {icon}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p
          id={`${id}-error`}
          className="mt-2 text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default FormInput;

// ============================================
// EXAMPLE USAGE
// ============================================

/*
import { useState } from 'react';
import FormInput from '@/app/components/ui/form_input';
// Import your icon library (e.g., react-icons)
import { FiUser, FiMail, FiLock, FiCalendar } from 'react-icons/fi';

export default function ExampleForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Example Form</h2>

      {/* Text Input with Icon *//*}
      <FormInput
        label="Full Name"
        type="text"
        id="name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Enter your full name"
        icon={<FiUser size={20} />}
        iconPosition="left"
        required
      />

      {/* Email Input with Icon *//*}
      <FormInput
        label="Email Address"
        type="email"
        id="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="example@email.com"
        icon={<FiMail size={20} />}
        iconPosition="left"
        required
      />

      {/* Password Input with Icon *//*}
      <FormInput
        label="Password"
        type="password"
        id="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Enter a strong password"
        icon={<FiLock size={20} />}
        iconPosition="left"
        required
      />

      {/* Number Input with Right Icon *//*}
      <FormInput
        label="Age"
        type="number"
        id="age"
        name="age"
        value={formData.age}
        onChange={handleChange}
        placeholder="Enter your age"
        icon={<FiCalendar size={20} />}
        iconPosition="right"
      />

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Submit
      </button>
    </form>
  );
}
*/