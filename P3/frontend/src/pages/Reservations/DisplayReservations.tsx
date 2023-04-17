import { Reservation } from "../../assets/types/Reservation";
import ReservationCard from "../../components/Reservations/ReservationCard";

const DisplayReservations = ({
	reservations,
	setSelectedRes,
	filteringInfo,
}: {
	reservations: Reservation[];
	setSelectedRes: React.Dispatch<React.SetStateAction<Reservation | null>>;
	filteringInfo: { sortBy: string; stateToFilterBy: string };
}) => {
	let sortedReservations: Reservation[] = [];

	if (filteringInfo.sortBy.toLowerCase() === "status") {
		sortedReservations = reservations.sort((a, b) => {
			if (a.status < b.status) return -1;
			else if (a.status === b.status) return 0;
			else return 1;
		});
	} else {
		sortedReservations = reservations.sort((a, b) => {
			if (a.start_date < b.start_date) return -1;
			else if (a.start_date === b.start_date) return 0;
			else return 1;
		});
	}
	if (filteringInfo.stateToFilterBy !== "") {
		sortedReservations = sortedReservations.filter(
			(r) =>
				r.status.toLowerCase() === filteringInfo.stateToFilterBy.toLowerCase()
		);
	}
	return (
		<div className="w-full flex overflow-x-auto flex-col flex-wrap sm:flex-row sm:justify-center">
			{sortedReservations.map((reservation) => {
				return (
					<ReservationCard
						reservation={reservation}
						setSelectedRes={setSelectedRes}
					/>
				);
			})}
		</div>
	);
};

export default DisplayReservations;