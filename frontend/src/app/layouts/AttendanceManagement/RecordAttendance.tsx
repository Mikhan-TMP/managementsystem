import DigitalClock from "@/app/components/ui/digitalClock";
import FormInput from "@/app/components/ui/form_input";
import { Button } from "@/app/components/ui/buttons";
import { useEffect, useState } from "react";

interface RecordAttendanceProps {
    onSubmit: (timeValue: string) => Promise<void>;
    loading: boolean;
}

export default function RecordAttendance({ onSubmit, loading }: RecordAttendanceProps) {
    // Helper function to get time in HH:MM:SS format
    const getCurrentTime = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    const [timeValue, setTimeValue] = useState(getCurrentTime());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isManuallyEdited, setIsManuallyEdited] = useState(false);
    
    useEffect(() => {
        const interval = setInterval(() => {
            if (!isManuallyEdited) {
                setTimeValue(getCurrentTime());
            }
        }, 1000);
        
        return () => clearInterval(interval);
    }, [isManuallyEdited]);

    const handleTimeSubmit = async () => {
        setIsSubmitting(true);
        console.log('Submitting time:', timeValue);
        try {
            // Pass the current timeValue to onSubmit
            await onSubmit(timeValue);
            // Reset to auto-update after submission
            setIsManuallyEdited(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTimeValue(e.target.value);
        setIsManuallyEdited(true);
    };

    return(
        <>
        <div className="mb-6">
            <DigitalClock />
            {/* Time Picker */}
            <div className="space-y-4">
                <div className="space-y-1">
                    <FormInput
                        label="Select Time"
                        type="time"
                        step="1" 
                        name="timeIn"
                        id="timeIn"
                        value={timeValue}
                        onChange={handleTimeChange}
                        className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-800"
                    />
                </div>
            </div>
            <div className="flex flex-col gap-3 mt-6">
                <Button 
                    variant="primary" 
                    size="medium" 
                    onClick={handleTimeSubmit}
                    className='cursor-pointer'
                    disabled={loading || isSubmitting}
                >
                    {(loading || isSubmitting) ? 'Submitting...' : 'Submit'}
                </Button>
            </div>
        </div>
        </>
    )
}