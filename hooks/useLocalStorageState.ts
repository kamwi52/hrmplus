import React, { useState, useEffect } from 'react';

function useLocalStorageState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [state, setState] = useState<T>(() => {
        try {
            const storedValue = window.localStorage.getItem(key);
            if (!storedValue || storedValue === '[]') {
                return defaultValue;
            }
            
            const parsedValue = JSON.parse(storedValue);

            // Simple data migration for employees with old structure
            if (key === 'employees' && Array.isArray(parsedValue)) {
                return parsedValue.map((emp: any) => ({
                    ...emp,
                    earnings: emp.earnings || [],
                    deductions: emp.deductions || [],
                })) as T;
            }

            return parsedValue;
        } catch (error) {
            console.error(`Error parsing localStorage key "${key}":`, error);
            return defaultValue;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, state]);

    return [state, setState];
}

export { useLocalStorageState };