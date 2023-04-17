import { Box, Modal } from "@mui/material";
import useToken from "../../assets/hooks/useToken";

type FilteringInfo = {
	sortBy: string;
	stateToFilterBy: string;
	userType: string;
};

type FilteringModalProps = {
	openFiltering: boolean;
	setOpenFiltering: React.Dispatch<React.SetStateAction<boolean>>;
	filteringInfo: FilteringInfo;
	setFilteringInfo: React.Dispatch<React.SetStateAction<FilteringInfo>>;
	entriesPerPage: number;
	setEntriesPerPage: React.Dispatch<React.SetStateAction<number>>;
};

const FilteringModal = ({
	openFiltering,
	setOpenFiltering,
	filteringInfo,
	setFilteringInfo,
    entriesPerPage,
    setEntriesPerPage,
}: FilteringModalProps) => {
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
    const { data } = useToken();
	const setType = (newType: string) => {
		const temp = filteringInfo;
		temp.userType = newType;
		setFilteringInfo(temp);
	}

	return (
		<div>
			<div className="flex justify-center pt-2">
				<button
					className="transition duration-100 ease-in-out w-32 bg-white hover:bg-red-400 text-black
                    font-semibold py-2 px-4 rounded border border-black"
					onClick={(e) => {
						e.preventDefault();
						setOpenFiltering(true);
					}}
				>
					Filter/Sort
				</button>
			</div>
			<Modal open={openFiltering} onClose={() => setOpenFiltering(false)}>
				<Box sx={box_style}>
					<div className="flex flex-col gap-4">
						<div className="flex flex-col">
							<label className="font-semibold">Sort By</label>
							<select
								value={filteringInfo.sortBy}
								onChange={(e) =>
									setFilteringInfo({ ...filteringInfo, sortBy: e.target.value })
								}
							>
								<option value="Start Date">Start Date</option>
								<option value="Status">Status</option>
							</select>
						</div>
						<div className="flex flex-col">
							<label className="font-semibold">Status</label>
							<select
								value={filteringInfo.stateToFilterBy}
								onChange={(e) => {
									setFilteringInfo( prev => ({
										...prev,
										stateToFilterBy: e.target.value,
									}))
								}}
							>
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
							<input
								value={entriesPerPage}
								onChange={(e) => setEntriesPerPage(e.target.valueAsNumber)}
								type="number"
								min={1}
							/>
						</div>
						{data.account_type === "Host" && (
							<div className="flex flex-col">
								<label className="font-semibold">User Type</label>
								<select
									value={filteringInfo.userType}
									onChange={(e) => setFilteringInfo({ ...filteringInfo, userType: e.target.value })}
								>
									<option value="Host">Host</option>
									<option value="User">User</option>
								</select>
							</div>
						)}
					</div>
				</Box>
			</Modal>
		</div>
	);
};

export default FilteringModal;