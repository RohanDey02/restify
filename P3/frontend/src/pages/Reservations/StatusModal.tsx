import { Modal } from "@mui/material";
import { Reservation } from "../../assets/types/Reservation";
import ModalBox from "./StatusModalBox";

type StatusModalProps = {
	setSelectedRes: React.Dispatch<React.SetStateAction<Reservation | null>>;
	setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
	selectedRes: Reservation | null;
};
const StatusModal = ({
	selectedRes,
	setSelectedRes,
	setReservations,
}: StatusModalProps) => {
	return (
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
	);
};

export default StatusModal;
