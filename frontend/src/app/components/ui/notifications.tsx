"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";

// ============================================================================
// REUSABLE ANIMATED NOTIFICATION COMPONENT
// ============================================================================

type NotificationType = "success" | "error" | "warning" | "info";

interface NotificationProps {
  type: NotificationType;
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number; // Duration in milliseconds (default: 5000ms)
}

const notificationConfig = {
  success: {
    bgColor: "bg-green-50",
    borderColor: "border-green-500",
    textColor: "text-green-800",
    iconColor: "text-green-500",
    Icon: CheckCircle,
  },
  error: {
    bgColor: "bg-red-50",
    borderColor: "border-red-500",
    textColor: "text-red-800",
    iconColor: "text-red-500",
    Icon: XCircle,
  },
  warning: {
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-500",
    textColor: "text-yellow-800",
    iconColor: "text-yellow-500",
    Icon: AlertTriangle,
  },
  info: {
    bgColor: "bg-blue-50",
    borderColor: "border-blue-500",
    textColor: "text-blue-800",
    iconColor: "text-blue-500",
    Icon: Info,
  },
};

export const AnimatedNotification: React.FC<NotificationProps> = ({
  type,
  message,
  isVisible,
  onClose,
  duration = 5000,
}) => {
  const config = notificationConfig[type];
  const Icon = config.Icon;

  // Auto-dismiss after specified duration
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
          }}
          className="fixed top-4 right-4 z-50 max-w-md w-full"
        >
          <div
            className={`${config.bgColor} ${config.borderColor} border-l-4 rounded-lg shadow-lg p-4 flex items-start space-x-3`}
            role="alert"
            aria-live="assertive"
          >
            {/* Icon */}
            <Icon className={`${config.iconColor} w-6 h-6 flex-shrink-0 mt-0.5`} />

            {/* Message */}
            <div className="flex-1">
              <p className={`${config.textColor} text-sm font-medium leading-relaxed`}>
                {message}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className={`${config.textColor} hover:opacity-70 transition-opacity flex-shrink-0`}
              aria-label="Close notification"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ============================================================================
// EXAMPLE USAGE
// ============================================================================

/**
 * Example 1: Success Notification (e.g., after form submission)
 * 
 * import { useState } from 'react';
 * import { AnimatedNotification } from './components/ui/notifications';
 * 
 * function MyFormComponent() {
 *   const [showSuccess, setShowSuccess] = useState(false);
 * 
 *   const handleSubmit = async (e: React.FormEvent) => {
 *     e.preventDefault();
 *     // Simulate form submission
 *     await submitForm();
 *     setShowSuccess(true);
 *   };
 * 
 *   return (
 *     <div>
 *       <form onSubmit={handleSubmit}>
 *         <button type="submit">Submit</button>
 *       </form>
 * 
 *       <AnimatedNotification
 *         type="success"
 *         message="Form submitted successfully!"
 *         isVisible={showSuccess}
 *         onClose={() => setShowSuccess(false)}
 *         duration={5000}
 *       />
 *     </div>
 *   );
 * }
 */

/**
 * Example 2: Error Notification (e.g., after failed API request)
 * 
 * import { useState } from 'react';
 * import { AnimatedNotification } from './components/ui/notifications';
 * 
 * function MyApiComponent() {
 *   const [showError, setShowError] = useState(false);
 *   const [errorMessage, setErrorMessage] = useState('');
 * 
 *   const fetchData = async () => {
 *     try {
 *       const response = await fetch('/api/data');
 *       if (!response.ok) throw new Error('Failed to fetch data');
 *       // Handle success
 *     } catch (error) {
 *       setErrorMessage(error.message || 'An unexpected error occurred');
 *       setShowError(true);
 *     }
 *   };
 * 
 *   return (
 *     <div>
 *       <button onClick={fetchData}>Fetch Data</button>
 * 
 *       <AnimatedNotification
 *         type="error"
 *         message={errorMessage}
 *         isVisible={showError}
 *         onClose={() => setShowError(false)}
 *         duration={7000}
 *       />
 *     </div>
 *   );
 * }
 */

/**
 * Example 3: Info & Warning Notifications
 * 
 * import { useState } from 'react';
 * import { AnimatedNotification } from './components/ui/notifications';
 * 
 * function MyNotificationDemo() {
 *   const [notifications, setNotifications] = useState({
 *     info: false,
 *     warning: false,
 *   });
 * 
 *   return (
 *     <div className="p-4 space-y-2">
 *       <button 
 *         onClick={() => setNotifications(prev => ({ ...prev, info: true }))}
 *         className="px-4 py-2 bg-blue-500 text-white rounded"
 *       >
 *         Show Info
 *       </button>
 * 
 *       <button 
 *         onClick={() => setNotifications(prev => ({ ...prev, warning: true }))}
 *         className="px-4 py-2 bg-yellow-500 text-white rounded"
 *       >
 *         Show Warning
 *       </button>
 * 
 *       <AnimatedNotification
 *         type="info"
 *         message="This is an informational message for your reference."
 *         isVisible={notifications.info}
 *         onClose={() => setNotifications(prev => ({ ...prev, info: false }))}
 *         duration={4000}
 *       />
 * 
 *       <AnimatedNotification
 *         type="warning"
 *         message="Warning: Please review your input before proceeding."
 *         isVisible={notifications.warning}
 *         onClose={() => setNotifications(prev => ({ ...prev, warning: false }))}
 *         duration={6000}
 *       />
 *     </div>
 *   );
 * }
 */

/**
 * Example 4: Multiple Notifications with Stacking
 * 
 * import { useState } from 'react';
 * import { AnimatedNotification } from './components/ui/notifications';
 * 
 * type Notification = {
 *   id: string;
 *   type: 'success' | 'error' | 'warning' | 'info';
 *   message: string;
 * };
 * 
 * function MultiNotificationExample() {
 *   const [notifications, setNotifications] = useState<Notification[]>([]);
 * 
 *   const addNotification = (type: Notification['type'], message: string) => {
 *     const newNotification: Notification = {
 *       id: Date.now().toString(),
 *       type,
 *       message,
 *     };
 *     setNotifications(prev => [...prev, newNotification]);
 *   };
 * 
 *   const removeNotification = (id: string) => {
 *     setNotifications(prev => prev.filter(notif => notif.id !== id));
 *   };
 * 
 *   return (
 *     <div>
 *       <button onClick={() => addNotification('success', 'Operation completed!')}>
 *         Trigger Success
 *       </button>
 * 
 *       {notifications.map((notif, index) => (
 *         <div key={notif.id} style={{ top: `${4 + index * 5}rem` }}>
 *           <AnimatedNotification
 *             type={notif.type}
 *             message={notif.message}
 *             isVisible={true}
 *             onClose={() => removeNotification(notif.id)}
 *             duration={5000}
 *           />
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 */