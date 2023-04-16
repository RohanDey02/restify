import { useGetPropById } from "../../assets/hooks/useGetPropById";
import { useGetResById } from "../../assets/hooks/useGetReservationById";
import useToken from "../../assets/hooks/useToken";
import { Reservation } from "../../assets/types/Reservation";
import NoImage from "../../assets/images/no-image.png";

type ReservationCardProps = {
	reservation: Reservation;
	setSelectedRes: React.Dispatch<React.SetStateAction<Reservation | null>>;
};
const ReservationCard = ({
	reservation,
	setSelectedRes,
}: ReservationCardProps) => {
	const { tokens } = useToken();
	// need to grab reservation by id because only the individual endpoint has the property foreign key
	const { resWithForeignKeys } = useGetResById(reservation.id, tokens?.access);
	const { property } = useGetPropById(
		resWithForeignKeys?.property,
		tokens?.access
	);
	if (!property) return <div>Loading...</div>;
	const status_styles = () => {
		switch (reservation.status) {
			case "Pending":
				return "text-gray-500";
			case "Approved":
				return "text-green-500 ";
			case "Completed":
				return "text-green-500";
			case "Denied":
				return "text-red-500";
			case "Terminated":
				return "text-red-500";
			case "Expired":
				return "text-red-500";
			case "Cancelled":
				return "text-red-500";
			default:
				return "text-gray-300";
		}
	};

	return (
		<div
			className="grid grid-cols-1 justify-center cursor-pointer
            hover:bg-blue-200 bg-blue-100 text-sm border-solid
            border-inherit border-4 rounded-md p-2 m-2 font-sans"
			onClick={() => setSelectedRes(reservation)}
		>
			<img
				src={property.images.length !== 0 ? property.images[0] : NoImage}
				alt="property"
				className="w-full h-48 object-cover"
			/>
			<p className="text-gray-500">${property.price}/night</p>
			<p className="font-semibold text-blue-400">{property.title}</p>
			<p className="text-gray-500">
				{reservation.start_date} - {reservation.end_date}
			</p>
			<p className={status_styles() + " font-semibold"}>
				Status: {reservation.status}
			</p>
		</div>
	);
};

export default ReservationCard;