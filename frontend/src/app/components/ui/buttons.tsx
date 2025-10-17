import React from 'react';

// ============================================
// REUSABLE BUTTON COMPONENT
// ============================================

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  // Base styles
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  // Variant styles
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 active:bg-blue-800',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 active:bg-gray-800',
    outline: 'bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500 active:bg-blue-100',
  };

  // Size styles
  const sizeStyles = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };

  // Combine all styles
  const buttonClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return (
    <button
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

// ============================================
// EXAMPLE USAGE (for reference only)
// ============================================

/*
// Example 1: Primary Large Button
<Button 
  variant="primary" 
  size="large" 
  onClick={() => console.log('Clicked!')}
>
  Click Me
</Button>

// Example 2: Secondary Small Button
<Button 
  variant="secondary" 
  size="small" 
  onClick={() => alert('Secondary button clicked!')}
>
  Cancel
</Button>

// Example 3: Outline Button with Loading State
<Button 
  variant="outline" 
  size="medium" 
  isLoading={true}
>
  Loading...
</Button>

// Example 4: Disabled Button
<Button 
  variant="primary" 
  size="medium" 
  disabled={true}
>
  Disabled
</Button>

// Example 5: Custom className
<Button 
  variant="primary" 
  size="medium" 
  className="shadow-lg hover:shadow-xl"
  onClick={() => console.log('Custom styled button')}
>
  Custom Style
</Button>

// Example 6: Full-width Button
<Button 
  variant="secondary" 
  size="large" 
  className="w-full"
>
  Full Width Button
</Button>
*/