"use client"
import { useEffect } from "react";

export function useFingerPrint(){
    useEffect(() => {
        const existing = localStorage.getItem("anon_id");
        if(!existing){
            const newId = crypto.randomUUID();
            localStorage.setItem("anon_id", newId);

            document.cookie = `anon_id=${newId}; path=/; max-age=31536000`
        }
    }, [])
}