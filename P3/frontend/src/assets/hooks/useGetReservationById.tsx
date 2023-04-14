import { useEffect, useState } from "react";
import { Reservation } from "../types/Reservation";

export const useGetResById = (id: number | undefined, token: string | undefined) => {
    const [resWithForeignKeys, setReservation] = useState<Reservation | null>(null);
    const [error, setError] = useState<string>("");
    const getReservation = async () => {
        if (!id || !token) return;
        const res = await fetch(`/reservations/${id}/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        if (res.ok){
            const success_response = await res.json();
            setReservation(success_response.data);
            return;
        }
        // Error occured in api call
        const errorResponse = await res.json();
        setError(errorResponse.details);
    }
    useEffect(() => {
        getReservation();
    }, [id, token]);

    return { resWithForeignKeys , error }
}