import React from 'react';

// ============================================
// REUSABLE SELECT INPUT COMPONENT
// ============================================

interface SelectOption {
  value: string;
  label: string;
}

interface SelectInputProps {
  label?: string;
  name: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: string;
  required?: boolean;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  label,
  name,
  id,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  disabled = false,
  className = '',
  error,
  required = false,
}) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-white/70 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`
          w-full px-4 py-2.5 
          border border-gray-300 rounded-lg 
          bg-gray-900 text-gray-300
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:bg-gray-900 disabled:cursor-not-allowed disabled:text-gray-500
          transition duration-200 ease-in-out
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option className='text-white' key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <svg
            className="w-4 h-4 mr-1"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

// ============================================
// EXAMPLE USAGE
// ============================================

export default function SelectInputExamples() {
  const [country, setCountry] = React.useState('');
  const [role, setRole] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [roleError, setRoleError] = React.useState('');

  // Country options
  const countryOptions: SelectOption[] = [
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
    { value: 'au', label: 'Australia' },
    { value: 'de', label: 'Germany' },
  ];

  // Role options
  const roleOptions: SelectOption[] = [
    { value: 'admin', label: 'Administrator' },
    { value: 'user', label: 'User' },
    { value: 'moderator', label: 'Moderator' },
    { value: 'guest', label: 'Guest' },
  ];

  // Category options
  const categoryOptions: SelectOption[] = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'books', label: 'Books' },
    { value: 'home', label: 'Home & Garden' },
    { value: 'sports', label: 'Sports & Outdoors' },
  ];

  // Simulate validation error for role
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setRole(value);
    
    if (value === 'admin') {
      setRoleError('Admin role requires additional permissions.');
    } else {
      setRoleError('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Select Input Component Examples
      </h1>

      {/* Example 1: Country Selection */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-800">
          1. Country Selection
        </h2>
        <SelectInput
          label="Select Country"
          name="country"
          id="country-select"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          options={countryOptions}
          placeholder="Choose your country"
          required
        />
        {country && (
          <p className="text-sm text-gray-600">
            Selected: {countryOptions.find(c => c.value === country)?.label}
          </p>
        )}
      </div>

      {/* Example 2: Role Selection with Error */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-800">
          2. Role Selection (with Error State)
        </h2>
        <SelectInput
          label="User Role"
          name="role"
          id="role-select"
          value={role}
          onChange={handleRoleChange}
          options={roleOptions}
          placeholder="Select a role"
          error={roleError}
          required
        />
      </div>

      {/* Example 3: Category Selection (Disabled) */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-800">
          3. Category Selection (Disabled State)
        </h2>
        <SelectInput
          label="Product Category"
          name="category"
          id="category-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={categoryOptions}
          placeholder="Select a category"
          disabled
        />
        <p className="text-sm text-gray-500 italic">
          This select is disabled for demonstration purposes.
        </p>
      </div>

      {/* Example 4: Custom Styled Select */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-800">
          4. Custom Styled Select
        </h2>
        <SelectInput
          label="Category"
          name="custom-category"
          id="custom-category-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={categoryOptions}
          placeholder="Pick your favorite"
          className="bg-blue-50 border-blue-300 text-blue-900 font-semibold"
        />
      </div>
    </div>
  );
}