import { useEffect, useState } from "react";
import { Reservation } from "../types/Reservation";

export const useGetMyReservations = (
	token: string | undefined,
	pageNum: number,
	pageSize: number,
	setNextExists: React.Dispatch<React.SetStateAction<boolean>>,
	filteringInfo: {
		sortBy: string;
		stateToFilterBy: string;
		userType: string;
	}
) => {
	const [reservations, setReservations] = useState<Reservation[]>([]);
	const getMyReservations = async () => {
		if (token === undefined) return;
		const res = await fetch(
			`/reservations/mine/?page_size=${pageSize}&page=${pageNum}&userType=${filteringInfo.userType}`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);
		if (res.ok) {
			const data = await res.json();
			setReservations(data.results);
			console.log(data.results);
			console.log("Reservations successfully fetched");
			if (data.next === null) {
				setNextExists(false);
			} else {
				setNextExists(true);
			}
			return;
		}
		// Error occured in api call
		console.log(await res.json());
	};
	useEffect(() => {
		getMyReservations();
	}, [token, pageNum, pageSize, filteringInfo]);
	return { reservations, setReservations };
};
