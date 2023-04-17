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
	// grab user info and access token
	const { tokens, data } = useToken();
	// state for the selected reservation, used for the Status modal
	const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);
	const access_token = tokens.access;

	// states for pagination and filtering
	const [pageNum, setPageNum] = useState(1);
	const [entriesPerPage, setEntriesPerPage] = useState(3);
	const [nextExists, setNextExists] = useState(true);
	const [openFiltering, setOpenFiltering] = useState(false);

	// state for filtering information, used to filter the reservations
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
			{/* title of the page */}
			<h2 className="text-center text-2xl font-bold text-teal-700 sm:text-3xl pt-3">
				Reservations
			</h2>
			{/* contains button to open filtering modal and the modal itself which handles filtering */}
			<FilteringModal
				entriesPerPage={entriesPerPage}
				filteringInfo={filteringInfo}
				openFiltering={openFiltering}
				setEntriesPerPage={setEntriesPerPage}
				setFilteringInfo={setFilteringInfo}
				setOpenFiltering={setOpenFiltering}
			/>
			{/* takes a list of reservations and displays cards, also handles sorting the reservations based on the filtering information state */}
			<DisplayReservations
				reservations={reservations}
				setSelectedRes={setSelectedRes}
				filteringInfo={filteringInfo}
			/>
			{/* Contains SVGs used for arrows in pagination and displays current page num */}
			<Pagination
				nextExists={nextExists}
				pageNum={pageNum}
				setPageNum={setPageNum}
			/>
			{/* handles all the logic related to the popups for the cards themself, here you can change status of reservations, view original listing etc */}
			<StatusModal
				selectedRes={selectedRes}
				setSelectedRes={setSelectedRes}
				setReservations={setReservations}
			/>
		</div>
	);
}
