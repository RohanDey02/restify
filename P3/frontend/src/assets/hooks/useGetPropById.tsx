import { useEffect, useState } from "react";
import { Property } from "../types/Property";

export const useGetPropById = (id: number | undefined, token: string | undefined) => {
    const [property, setProperty] = useState<Property | null>(null);
    const [error, setError] = useState<string>("");
    const getProperty = async () => {
        if (!id || !token) return;
        const res = await fetch(`/property/${id}/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        if (res.ok){
            const success_response = await res.json();
            setProperty(success_response.data);
            return;
        }
        // Error occured in api call
        const errorResponse = await res.json();
        setError(errorResponse.details);
    }
    useEffect(() => {
        getProperty();
    }
    , [id, token]);
    return { property, error }
}