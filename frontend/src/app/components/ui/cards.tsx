import React from 'react';
import Image from 'next/image';

// ============================================
// REUSABLE CARD COMPONENT
// ============================================

interface CardProps {
  title?: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outlined' | 'elevated';
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  imageSrc,
  imageAlt = 'Card image',
  children,
  className = '',
  variant = 'default',
  onClick,
}) => {
  const baseStyles = 'rounded-lg transition-all duration-300 overflow-hidden';
  
  const variantStyles = {
    default: 'bg-white shadow-md hover:shadow-lg p-6',
    outlined: 'bg-white border-2 border-gray-200 hover:border-gray-300 p-6',
    elevated: 'bg-white shadow-xl hover:shadow-2xl hover:-translate-y-1 p-6',
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className} ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
    >
      {imageSrc && (
        <div className="relative w-full h-48 mb-4 -mx-6 -mt-6">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
          />
        </div>
      )}
      
      {title && (
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
      )}
      
      {description && (
        <p className="text-gray-600 mb-4">{description}</p>
      )}
      
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};

// ============================================
// EXAMPLE USAGE
// ============================================

export const CardExamples = () => {
  return (
    <div className="space-y-8 p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Card Component Examples</h1>
      
      {/* Example 1: Basic Card with Text */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Basic Card with Text</h2>
        <Card
          title="Basic Card"
          description="This is a simple card with just a title and description. Perfect for displaying basic information."
          className="max-w-md"
        />
      </div>

      {/* Example 2: Card with Image and Button */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Card with Image and Button</h2>
        <Card
          title="Beautiful Landscape"
          description="Explore stunning views and breathtaking scenery."
          imageSrc="/placeholder-image.jpg"
          imageAlt="Beautiful landscape"
          className="max-w-md"
        >
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors">
            Learn More
          </button>
        </Card>
      </div>

      {/* Example 3: Outlined Variant */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Outlined Variant</h2>
        <Card
          title="Outlined Card"
          description="This card uses the outlined variant for a different visual style."
          variant="outlined"
          className="max-w-md"
        />
      </div>

      {/* Example 4: Elevated Variant */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Elevated Variant</h2>
        <Card
          title="Elevated Card"
          description="This card has more prominent shadows and a lift effect on hover."
          variant="elevated"
          className="max-w-md"
        />
      </div>

      {/* Example 5: Card with Custom Children Content */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Card with Custom Content</h2>
        <Card
          title="Product Card"
          className="max-w-md"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Price:</span>
              <span className="text-2xl font-bold text-green-600">$49.99</span>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors">
                Add to Cart
              </button>
              <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded transition-colors">
                Wishlist
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* Example 6: Clickable Card */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Clickable Card</h2>
        <Card
          title="Interactive Card"
          description="Click this card to trigger an action!"
          variant="elevated"
          className="max-w-md"
          onClick={() => alert('Card clicked!')}
        />
      </div>

      {/* Example 7: Grid of Cards */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Grid Layout</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            title="Card 1"
            description="First card in a grid layout"
            variant="default"
          />
          <Card
            title="Card 2"
            description="Second card in a grid layout"
            variant="outlined"
          />
          <Card
            title="Card 3"
            description="Third card in a grid layout"
            variant="elevated"
          />
        </div>
      </div>

      {/* Example 8: Login Card */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Login Card</h2>
        <div className="flex justify-center">
          <Card
            title="Welcome Back"
            description="Sign in to your account to continue"
            variant="elevated"
            className="max-w-md w-full"
          >
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Login submitted!'); }}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="you@example.com"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-blue-500 hover:text-blue-600">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
              >
                Sign In
              </button>

              <div className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <a href="#" className="text-blue-500 hover:text-blue-600 font-medium">
                  Sign up
                </a>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
