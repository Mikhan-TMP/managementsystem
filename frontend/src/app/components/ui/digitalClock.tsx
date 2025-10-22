"use client";

import { useEffect, useState } from "react";


export default function DigitalClock() {
    const [now, setNow] = useState<Date>(() => new Date());

    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <div className="text-center bg-gray-900 dark:bg-black rounded-lg p-6 shadow-inner select-none">
            <div className="text-6xl font-mono font-bold text-green-400 dark:text-green-500 ">
                {now.toLocaleTimeString('en-US', {
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                })}
            </div>
            <div className="text-sm text-gray-400 mt-2">
                {now.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                })}
            </div>
        </div>
    );
}