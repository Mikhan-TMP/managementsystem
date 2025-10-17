import React from 'react';

// ============================================================================
// REUSABLE RADIO BUTTON GROUP COMPONENT
// ============================================================================

export interface RadioOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface RadioButtonGroupProps {
  label: string;
  name: string;
  options: RadioOption[];
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
  required?: boolean;
}

export const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({
  label,
  name,
  options,
  value,
  onChange,
  disabled = false,
  error,
  className = '',
  required = false,
}) => {
  return (
    <div className={`w-full ${className}`}>
      {/* Group Label */}
      <fieldset disabled={disabled}>
        <legend className="text-sm font-medium text-gray-900 mb-3">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </legend>

        {/* Radio Options */}
        <div className="space-y-3">
          {options.map((option) => {
            const isChecked = value === option.value;
            const isDisabled = disabled || option.disabled;
            const radioId = `${name}-${option.value}`;

            return (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={radioId}
                  name={name}
                  value={option.value}
                  checked={isChecked}
                  onChange={(e) => onChange(e.target.value)}
                  disabled={isDisabled}
                  className={`
                    h-4 w-4 
                    border-gray-300 
                    text-blue-600 
                    focus:ring-2 
                    focus:ring-blue-500 
                    focus:ring-offset-2
                    disabled:opacity-50 
                    disabled:cursor-not-allowed
                    cursor-pointer
                    transition-all
                    ${error ? 'border-red-500' : ''}
                  `}
                />
                <label
                  htmlFor={radioId}
                  className={`
                    ml-3 
                    text-sm 
                    font-normal 
                    text-gray-700
                    cursor-pointer
                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                    ${isChecked ? 'font-medium text-gray-900' : ''}
                  `}
                >
                  {option.label}
                </label>
              </div>
            );
          })}
        </div>
      </fieldset>

      {/* Error Message */}
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

// ============================================================================
// EXAMPLE USAGE SNIPPETS
// ============================================================================

// Example 1: Gender Selection
export const GenderSelectionExample: React.FC = () => {
  const [gender, setGender] = React.useState<string>('');

  const genderOptions: RadioOption[] = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Non-binary', value: 'non-binary' },
    { label: 'Prefer not to say', value: 'prefer-not-to-say' },
  ];

  return (
    <RadioButtonGroup
      label="Gender"
      name="gender"
      options={genderOptions}
      value={gender}
      onChange={setGender}
      className="max-w-md"
    />
  );
};

// Example 2: Payment Method Selection
export const PaymentMethodExample: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = React.useState<string>('credit-card');

  const paymentOptions: RadioOption[] = [
    { label: 'Credit Card', value: 'credit-card' },
    { label: 'Debit Card', value: 'debit-card' },
    { label: 'PayPal', value: 'paypal' },
    { label: 'Bank Transfer', value: 'bank-transfer' },
    { label: 'Cash on Delivery', value: 'cod', disabled: true }, // Disabled option
  ];

  return (
    <RadioButtonGroup
      label="Payment Method"
      name="payment-method"
      options={paymentOptions}
      value={paymentMethod}
      onChange={setPaymentMethod}
      required
      className="max-w-md"
    />
  );
};

// Example 3: Contact Preference with Error State
export const ContactPreferenceExample: React.FC = () => {
  const [contactType, setContactType] = React.useState<string>('');
  const [error, setError] = React.useState<string>('');

  const contactOptions: RadioOption[] = [
    { label: 'Email', value: 'email' },
    { label: 'Phone Call', value: 'phone' },
    { label: 'SMS', value: 'sms' },
    { label: 'WhatsApp', value: 'whatsapp' },
  ];

  const handleContactChange = (value: string) => {
    setContactType(value);
    setError(''); // Clear error when user makes a selection
  };

  const handleSubmit = () => {
    if (!contactType) {
      setError('Please select a preferred contact method');
    } else {
      console.log('Selected contact type:', contactType);
    }
  };

  return (
    <div className="max-w-md">
      <RadioButtonGroup
        label="Preferred Contact Method"
        name="contact-preference"
        options={contactOptions}
        value={contactType}
        onChange={handleContactChange}
        error={error}
        required
        className="mb-4"
      />
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Submit
      </button>
    </div>
  );
};

// Example 4: Disabled Radio Group
export const DisabledExample: React.FC = () => {
  const subscriptionOptions: RadioOption[] = [
    { label: 'Basic Plan - $9.99/month', value: 'basic' },
    { label: 'Pro Plan - $19.99/month', value: 'pro' },
    { label: 'Enterprise Plan - $49.99/month', value: 'enterprise' },
  ];

  return (
    <RadioButtonGroup
      label="Subscription Plan"
      name="subscription"
      options={subscriptionOptions}
      value="pro"
      onChange={() => {}}
      disabled
      className="max-w-md"
    />
  );
};
