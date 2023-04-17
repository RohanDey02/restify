import { useNavigate } from "react-router-dom";
import useToken from "../../assets/hooks/useToken";
import { Box } from "@mui/material";
import { useGetResById } from "../../assets/hooks/useGetReservationById";
import { Reservation } from "../../assets/types/Reservation";
import { useGetPropById } from "../../assets/hooks/useGetPropById";

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
	const navigate = useNavigate();
	const { resWithForeignKeys } = useGetResById(selectedRes.id, tokens.access);
	const { property } = useGetPropById(
		resWithForeignKeys?.property,
		tokens.access
	);
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
			const notification_message = `Request at ${property?.title} for date ${selectedRes.start_date} was approved.`;
			const notification_res = await fetch("/notifications/create/", {
				method: "POST",
				body: JSON.stringify({
					title: "Approved Request",
					description: notification_message,
					status: "Unread",
					user_id: resWithForeignKeys?.user,
				}),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${tokens.access}`,
				},
			});
			await notification_res.json();
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
			const notification_message = `Request at ${property?.title} for date ${selectedRes.start_date} was denied.`;
			const notification_res = await fetch("/notifications/create/", {
				method: "POST",
				body: JSON.stringify({
					title: "Denied Request",
					description: notification_message,
					status: "Unread",
					user_id: resWithForeignKeys?.user,
				}),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${tokens.access}`,
				},
			});
			await notification_res.json();
		}
		setSelectedRes(null);
	};

	const handleCancel = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault();
		const notification_message = `Cancellation request at ${property?.title} for date ${selectedRes.start_date}.`;
		const notification_res = await fetch("/notifications/create/", {
			method: "POST",
			body: JSON.stringify({
				title: "Cancellation Request",
				description: notification_message,
				status: "Unread",
				url: `${resWithForeignKeys?.id}`,
				host_id: resWithForeignKeys?.host,
			}),
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${tokens.access}`,
			},
		});
		await notification_res.json();
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
			const notification_message = `Reservation terminated at ${property?.title} for date ${selectedRes.start_date}.`;
			const notification_res = await fetch("/notifications/create/", {
				method: "POST",
				body: JSON.stringify({
					title: "Terminated Reservation",
					description: notification_message,
					status: "Unread",
					url: "",
					user_id: resWithForeignKeys?.user,
				}),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${tokens.access}`,
				},
			});
			await notification_res.json();
		}
		setSelectedRes(null);
	};

	if (selectedRes.status === "Pending" && data.account_type === "Host") {
		return (
			<Box sx={box_style}>
				<p
					className="text-xl text-center text-blue-400 cursor-pointer hover:text-blue-500 mb-3"
					onClick={() =>
						navigate("/property", { state: resWithForeignKeys?.property })
					}
				>
					View Original Listing
				</p>
				<p className="text-xs text-red-500 text-center mt-3">
					WARNING: The buttons below correspond to irreversible actions, please
					be sure about your choice before clicking!
				</p>
				<div className="flex justify-center gap-2 mt-3">
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
				<p
					className="text-xl text-center text-blue-400 cursor-pointer hover:text-blue-500 mb-3"
					onClick={() =>
						navigate("/property", { state: resWithForeignKeys?.property })
					}
				>
					View Original Listing
				</p>
				<p className="text-xs text-red-500 text-center">
					WARNING: The button below cancels your pending reservation request!
				</p>
				<div className="flex justify-center gap-2 mt-3">
					<button
						className="transition duration-100 ease-in-out w-32 bg-white hover:bg-red-400 text-black
                            font-semibold py-2 px-4 rounded border border-black flex justify-center"
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
				<p
					className="text-xl text-center text-blue-400 cursor-pointer hover:text-blue-500 mb-3"
					onClick={() =>
						navigate("/property", { state: resWithForeignKeys?.property })
					}
				>
					View Original Listing
				</p>
				<p className="text-xs text-red-500 text-center mt-3">
					WARNING: The button below cancels your current reservation request!
					The host will be notified, note refunds are not guaranteed.
				</p>
				<div className="flex justify-center gap-2 mt-3">
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
				<p
					className="text-xl text-center text-blue-400 cursor-pointer hover:text-blue-500"
					onClick={() =>
						navigate("/property", { state: resWithForeignKeys?.property })
					}
				>
					View Original Listing
				</p>
				<p className="text-xs text-red-500 text-center mt-3">
					WARNING: The button below terminates your current reservation request!
					The guest will be refunded and notified.
				</p>
				<div className="flex justify-center gap-2 mt-3">
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
				<p
					className="text-xl text-center text-blue-400 cursor-pointer hover:text-blue-500"
					onClick={() => navigate(`/initialrating/${selectedRes.id}`)}
				>
					Leave a Review
				</p>
				<p
					className="text-xl text-center text-blue-400 cursor-pointer hover:text-blue-500"
					onClick={() =>
						navigate("/property", { state: resWithForeignKeys?.property })
					}
				>
					View Original Listing
				</p>
			</Box>
		);
	} else {
		return (
			<Box sx={box_style}>
				<p
					className="text-xl text-center text-blue-400 cursor-pointer hover:text-blue-500"
					onClick={() =>
						navigate("/property", { state: resWithForeignKeys?.property })
					}
				>
					View Original Listing
				</p>
			</Box>
		);
	}
};

export default ModalBox;
