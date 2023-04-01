import { useEffect, useState } from "react";
import { Reservation } from "../types/Reservation";
const API_ROOT = "http://localhost:8000"
export const useGetMyReservations = (token: string) => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const getMyReservations = async () => {
        const res = await fetch(`${API_ROOT}/reservations/mine/`, {
            method: "GET",
            headers: {
                authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        if (res.ok){
            setReservations(await res.json());
            console.log("Reservations successfully fetched");
            return;
        }
        // Error occured in api call
        console.log(await res.json());
    }
    useEffect(() => {
        getMyReservations();
    }, []);
    return { reservations }
}