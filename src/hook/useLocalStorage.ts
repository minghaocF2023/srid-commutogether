"use client";
import { useState, useEffect, Dispatch, SetStateAction } from "react";

type StorageMode = "merge" | "overwrite";

function useLocalStorage<T>(
    key: string,
    initialValue: T,
    mode: StorageMode = "overwrite"
): [T, Dispatch<SetStateAction<T>>] {
    
    const storedValue =
        typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
    const initial = storedValue ? (JSON.parse(storedValue) as T) : initialValue;
    const [value, setValue] = useState<T>(initial);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const existingValue = window.localStorage.getItem(key);
            let newValue;
            if (mode === "merge" && existingValue) {
                newValue = { ...JSON.parse(existingValue), ...value };
            } else {
                newValue = value;
            }
            localStorage.setItem(key, JSON.stringify(newValue));
        }
    }, [key, value, mode]);

    return [value, setValue];
}

export default useLocalStorage;
