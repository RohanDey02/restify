import { useGetMyReservations } from "../../assets/hooks/useGetMyReservations";
import useToken from "../../assets/hooks/useToken";
import { Reservation } from "../../assets/types/Reservation";
import Navbar from "../../components/Navbar/index";
import { useState } from "react";
import FilteringModal from "./FilteringModal";
import StatusModal from "./StatusModal";
import { Pagination } from "./Pagination";
import DisplayReservations from "./DisplayReservations";

export default function MyReservations() {
	const { tokens, data } = useToken();
	const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);
	const access_token = tokens.access;
	const [pageNum, setPageNum] = useState(1);
	const [entriesPerPage, setEntriesPerPage] = useState(3);
	const [nextExists, setNextExists] = useState(true);
	const [openFiltering, setOpenFiltering] = useState(false);
	const [filteringInfo, setFilteringInfo] = useState<{
		sortBy: string;
		stateToFilterBy: string;
		userType: string;
	}>({ sortBy: "Start Date", stateToFilterBy: "", userType: data.user_type });
	const { reservations, setReservations } = useGetMyReservations(
		access_token,
		pageNum,
		entriesPerPage,
		setNextExists,
		filteringInfo
	);

	return (
		<div className="w-full min-h-screen p-2 bg-gray-100">
			<Navbar currentLocation="/myreservations" firstName={data.first_name} />
			<h2 className="text-center text-2xl font-bold text-teal-700 sm:text-3xl pt-3">
				Reservations
			</h2>
			<FilteringModal
				entriesPerPage={entriesPerPage}
				filteringInfo={filteringInfo}
				openFiltering={openFiltering}
				setEntriesPerPage={setEntriesPerPage}
				setFilteringInfo={setFilteringInfo}
				setOpenFiltering={setOpenFiltering}
			/>
			<DisplayReservations
				reservations={reservations}
				setSelectedRes={setSelectedRes}
				filteringInfo={filteringInfo}
			/>
			<Pagination
				nextExists={nextExists}
				pageNum={pageNum}
				setPageNum={setPageNum}
			/>
			<StatusModal
				selectedRes={selectedRes}
				setSelectedRes={setSelectedRes}
				setReservations={setReservations}
			/>
		</div>
	);
}
