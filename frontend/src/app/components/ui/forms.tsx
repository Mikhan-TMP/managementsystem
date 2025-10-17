import React from 'react';

// ============================================================
// REUSABLE FORM CONTAINER COMPONENT
// ============================================================

interface FormContainerProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
}

export const FormContainer: React.FC<FormContainerProps> = ({
    title,
    description,
    children,
    onSubmit,
    className = '',
    }) => {
    const content = (
        <>
        {/* Title and Description Header */}
        {(title || description) && (
            <div className="mb-6">
            {title && (
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                {title}
                </h2>
            )}
            {description && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                {description}
                </p>
            )}
            </div>
        )}

        {/* Children Content */}
        <div className="space-y-4">
            {children}
        </div>
        </>
    );

    if (onSubmit) {
        return (
        <form
            onSubmit={onSubmit}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8 ${className}`}
        >
            {content}
        </form>
        );
    }

    // Otherwise, use a div wrapper
    return (
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8 ${className}`}>
        {content}
        </div>
    );
};

// ============================================================
// EXAMPLE USAGE SECTION
// ============================================================

// Example 1: Simple Content Block with Title and Description
export const Example1_SimpleContent = () => {
  return (
    <FormContainer
      title="Welcome to Our Platform"
      description="This is a simple content block using the FormContainer component."
    >
      <p className="text-gray-700 dark:text-gray-300">
        This component provides a consistent wrapper for various types of content.
        You can include paragraphs, images, or any other elements.
      </p>
      <p className="text-gray-700 dark:text-gray-300">
        The styling is handled automatically with Tailwind CSS utilities.
      </p>
    </FormContainer>
  );
};

// Example 2: Complete Form with Input Fields and Submit Button
export const Example2_FormWithInputs = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted!');
    // Handle form submission logic here
  };

  return (
    <FormContainer
      title="Contact Us"
      description="Fill out the form below and we'll get back to you as soon as possible."
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto"
    >
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
          placeholder="John Doe"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
          placeholder="john@example.com"
          required
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
          placeholder="Your message here..."
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition duration-200 ease-in-out transform hover:scale-105"
      >
        Send Message
      </button>
    </FormContainer>
  );
};

// Example 3: Custom Layout with Div Elements
export const Example3_CustomLayout = () => {
  return (
    <FormContainer
      title="Dashboard Overview"
      description="A flexible layout using the FormContainer for organizing content blocks."
      className="max-w-4xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-md">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
            Statistics
          </h3>
          <p className="text-blue-700 dark:text-blue-300">
            Total Users: 1,234
          </p>
        </div>

        <div className="bg-green-50 dark:bg-green-900 p-4 rounded-md">
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
            Revenue
          </h3>
          <p className="text-green-700 dark:text-green-300">
            $45,678
          </p>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Recent Activity
        </h3>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
          <li>User registration: 5 minutes ago</li>
          <li>New order placed: 12 minutes ago</li>
          <li>System update completed: 1 hour ago</li>
        </ul>
      </div>
    </FormContainer>
  );
};
