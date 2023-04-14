import { useGetMyReservations } from "../../assets/hooks/useGetMyReservations";
import useToken from "../../assets/hooks/useToken";
import { Reservation } from "../../assets/types/Reservation";
import Navbar from "../../components/Navbar/index";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { Navigate } from "react-router-dom";
import ReservationCard from "../../components/Reservations/ReservationCard";
import { useState } from "react";

const DisplayReservations = ({
	reservations,
	setSelectedRes,
	filteringInfo,
}: {
	reservations: Reservation[];
	setSelectedRes: React.Dispatch<React.SetStateAction<Reservation | null>>;
	filteringInfo: {sortBy: string, stateToFilterBy: string};
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
			else if (a.status === b.status) return 0;
			else return 1;
		});
	}
    if(filteringInfo.stateToFilterBy !== ""){
        sortedReservations = sortedReservations.filter(r => r.status.toLowerCase() === filteringInfo.stateToFilterBy.toLowerCase());
    }
	return (
		<div className="w-full flex flex-auto flex-col sm:flex-row sm:justify-center">
			{sortedReservations.map((reservation) => (
				<ReservationCard
					reservation={reservation}
					setSelectedRes={setSelectedRes}
				/>
			))}
		</div>
	);
};

export default function MyReservations() {
	const { tokens, data } = useToken();
	const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);
	const access_token = tokens.access;
	const [pageNum, setPageNum] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(3);
	const [nextExists, setNextExists] = useState(true);
    const [openFiltering, setOpenFiltering] = useState(false);
    const box_style = {
		position: "absolute" as "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: "50vh",
        height: "auto",
		bgcolor: "background.paper",
		border: "2px solid #000",
		boxShadow: 24,
		p: 4,
	}; // style for modal box
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

	const handleIncreasePage = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		if (nextExists) {
			setPageNum((prev) => prev + 1);
		}
	};
	const handleDecreasePage = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		if (pageNum > 1) {
			setPageNum((prev) => prev - 1);
		}
	};

	return (
		<div className="w-full min-h-screen p-2 bg-gray-100">
			<Navbar currentLocation="/myreservations" firstName={data.first_name} />
			<h2 className="text-2xl font-semibold flex justify-center font-sans pt-3">
				Reservations
			</h2>
			<div
				className="flex justify-center pt-2"
			>
                <button className="transition duration-100 ease-in-out w-32 bg-white hover:bg-red-400 text-black
                    font-semibold py-2 px-4 rounded border border-black"
                    onClick={(e) => {
                        e.preventDefault()
                        setOpenFiltering(true)}
                    }
                >
                    Filter/Sort
                </button>
            </div>
            <Modal
                open={openFiltering}
                onClose={() => setOpenFiltering(false)}
            >
                <Box sx={box_style}>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col">
                            <label className="font-semibold">Sort By</label>
                            <select value={filteringInfo.sortBy} onChange={e => setFilteringInfo({...filteringInfo, sortBy: e.target.value})}>
                                <option value="Start Date">Start Date</option>
                                <option value="Status">Status</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label className="font-semibold">Status</label>
                            <select value={filteringInfo.stateToFilterBy} onChange={e => setFilteringInfo({...filteringInfo, stateToFilterBy: e.target.value})}>
                                <option value=""></option>
                                <option value="Pending">Pending</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="Terminated">Terminated</option>
                                <option value="Approved">Approved</option>
                                <option value="Denied">Denied</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label className="font-semibold">Entries Per Page</label>
                            <input value={entriesPerPage} onChange={e => setEntriesPerPage(e.target.valueAsNumber)} type="number" min={1} />
                        </div>
                        {data.account_type === "Host" && <div className="flex flex-col">
                            <label className="font-semibold">User Type</label>
                            <select value={filteringInfo.userType} onChange={
                                e => {
                                    setFilteringInfo({...filteringInfo, userType: e.target.value})
                                }}>
                                <option value="Host">Host</option>
                                <option value="User">User</option>
                            </select>
                        </div>}

                    </div>
                </Box>
            </Modal>
			<DisplayReservations
				reservations={reservations}
				setSelectedRes={setSelectedRes}
				filteringInfo={filteringInfo}
			/>
			<div className="flex gap-2 justify-center">
				<div
					className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100 hover:bg-gray-300 cursor-pointer"
					onClick={handleDecreasePage}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-3 w-3"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fillRule="evenodd"
							d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
							clipRule="evenodd"
						/>
					</svg>
				</div>
				<p className="text-xs align-text-bottom">{pageNum}</p>
				<div
					className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100 cursor-pointer hover:bg-gray-300"
					onClick={handleIncreasePage}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-3 w-3"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fillRule="evenodd"
							d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
							clipRule="evenodd"
						/>
					</svg>
				</div>
			</div>
			<Modal open={selectedRes !== null} onClose={() => setSelectedRes(null)}>
				{selectedRes === null ? (
					<div></div>
				) : (
					<ModalBox
						setSelectedRes={setSelectedRes}
						setReservations={setReservations}
						selectedRes={selectedRes}
					/>
				)}
			</Modal>
		</div>
	);
}

type ModalBoxProps = {
	selectedRes: Reservation;
	setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
	setSelectedRes: React.Dispatch<React.SetStateAction<Reservation | null>>;
};
const ModalBox = ({
	selectedRes,
	setReservations,
	setSelectedRes,
}: ModalBoxProps) => {
	const { tokens, data } = useToken();

	const box_style = {
		position: "absolute" as "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: 400,
		bgcolor: "background.paper",
		border: "2px solid #000",
		boxShadow: 24,
		p: 4,
	};

	const handleApprove = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault();
		const res = await fetch(`/reservations/${selectedRes.id}/update/`, {
			method: "PUT",
			body: JSON.stringify({ status: "approved" }),
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${tokens.access}`,
			},
		});

		await res.json();
		if (res.ok) {
			setReservations((prev) =>
				prev.map((res) =>
					res.id === selectedRes.id ? { ...res, status: "Approved" } : res
				)
			);
		}
		setSelectedRes(null);
	};
	const handleDeny = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault();
		const res = await fetch(`/reservations/${selectedRes.id}/update/`, {
			method: "PUT",
			body: JSON.stringify({ status: "approved" }),
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${tokens.access}`,
			},
		});
		await res.json();
		if (res.ok) {
			setReservations((prev) =>
				prev.map((res) =>
					res.id === selectedRes.id ? { ...res, status: "Denied" } : res
				)
			);
		}
		setSelectedRes(null);
	};

	const handleCancel = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault();
		const res = await fetch(`/reservations/${selectedRes.id}/update/`, {
			method: "PUT",
			body: JSON.stringify({ status: "cancelled" }),
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${tokens.access}`,
			},
		});
		await res.json();
		if (res.ok) {
			setReservations((prev) =>
				prev.map((res) =>
					res.id === selectedRes.id ? { ...res, status: "Cancelled" } : res
				)
			);
		}
		setSelectedRes(null);
	};
	const handleTerminate = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault();
		const res = await fetch(`/reservations/${selectedRes.id}/update/`, {
			method: "PUT",
			body: JSON.stringify({ status: "terminated" }),
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${tokens.access}`,
			},
		});
		await res.json();
		if (res.ok) {
			setReservations((prev) =>
				prev.map((res) =>
					res.id === selectedRes.id ? { ...res, status: "Terminated" } : res
				)
			);
		}
		setSelectedRes(null);
	};
	if (selectedRes.status === "Pending" && data.account_type === "Host") {
		return (
			<Box sx={box_style}>
				<p>{selectedRes?.id}</p>
				<div className="flex justify-center gap-2">
					<button
						className="transition duration-100 ease-in-out w-32 bg-white hover:bg-green-400 text-black
                            font-semibold py-2 px-4 rounded border border-black "
						onClick={handleApprove}
					>
						Approve
					</button>
					<button
						className="transition duration-100 ease-in-out w-32 bg-white hover:bg-red-400 text-black
                            font-semibold py-2 px-4 rounded border border-black"
						onClick={handleDeny}
					>
						Deny
					</button>
				</div>
			</Box>
		);
	}
	if (selectedRes.status === "Pending" && data.account_type === "User") {
		return (
			<Box sx={box_style}>
				<p>{selectedRes?.id}</p>
				<div className="flex justify-center gap-2">
					<button
						className="transition duration-100 ease-in-out w-32 bg-white hover:bg-red-400 text-black
                            font-semibold py-2 px-4 rounded border border-black"
						onClick={handleCancel}
					>
						Cancel
					</button>
				</div>
			</Box>
		);
	} else if (
		selectedRes.status === "Approved" &&
		data.account_type === "User"
	) {
		return (
			<Box sx={box_style}>
				<p>{selectedRes?.id}</p>
				<div className="flex justify-center gap-2">
					<button
						className="transition duration-100 ease-in-out w-32 bg-white hover:bg-red-400 text-black
                            font-semibold py-2 px-4 rounded border border-black"
						onClick={handleCancel}
					>
						Cancel
					</button>
				</div>
			</Box>
		);
	} else if (
		selectedRes.status === "Approved" &&
		data.account_type === "Host"
	) {
		return (
			<Box sx={box_style}>
				<p>{selectedRes?.id}</p>
				<div className="flex justify-center gap-2">
					<button
						className="transition duration-100 ease-in-out w-32 bg-white hover:bg-red-400 text-black
                            font-semibold py-2 px-4 rounded border border-black"
						onClick={handleTerminate}
					>
						Terminate
					</button>
				</div>
			</Box>
		);
	} else if (selectedRes.status === "Completed") {
		return (
			<Box sx={box_style}>
				<p>{selectedRes?.id}</p>
				<div className="flex justify-center gap-2">
					<Navigate to="/property" state={selectedRes.property} />
				</div>
			</Box>
		);
	}
	return <Box></Box>;
};
