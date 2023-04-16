type PaginationProps = {
	pageNum: number;
	setPageNum: React.Dispatch<React.SetStateAction<number>>;
	nextExists: boolean;
};
export const Pagination = ({
	setPageNum,
	nextExists,
	pageNum,
}: PaginationProps) => {
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
	);
};
